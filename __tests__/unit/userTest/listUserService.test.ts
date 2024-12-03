import ListUserService from '../../../src/modules/User/services/ListUserService';
import User from '../../../src/modules/User/models/User';
import { Op } from 'sequelize';
import { AppError } from '../../../src/shared/http/errors/AppError';

jest.mock('../../../src/modules/User/models/User', () => ({
  count: jest.fn(),
  findAll: jest.fn(),
}));

describe('ListUserService', () => {
  const listUserService = new ListUserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar usuários com sucesso', async () => {
    const usersMock = [
      { id: 'user1', name: 'User One', email: 'userone@example.com' },
      { id: 'user2', name: 'User Two', email: 'usertwo@example.com' },
    ];

    (User.count as jest.Mock).mockResolvedValue(2); // Simula a contagem de usuários
    (User.findAll as jest.Mock).mockResolvedValue(usersMock); // Simula a busca de usuários

    const result = await listUserService.execute(
      { name: 'User', email: 'example.com', justActive: true },
      { nameOrder: 'ASC', createOrder: 'DESC', deleteOrder: 'ASC' },
      { page: 1, limit: 10 },
    );

    expect(User.count).toHaveBeenCalledWith({
      where: {
        name: { [Op.like]: '%User%' },
        email: { [Op.like]: '%example.com%' },
      },
      paranoid: true,
    });

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: { exclude: ['password'] },
      where: {
        name: { [Op.like]: '%User%' },
        email: { [Op.like]: '%example.com%' },
      },
      paranoid: true,
      order: [
        ['name', 'ASC'],
        ['createdAt', 'DESC'],
        ['deletedAt', 'ASC'],
      ],
      raw: true,
      offset: 0,
      limit: 10,
    });

    expect(result).toEqual({
      users: usersMock,
      pages: 1,
    });
  });

  it('deve lançar erro se nenhum usuário for encontrado', async () => {
    (User.count as jest.Mock).mockResolvedValue(0); // Simula que nenhum usuário foi encontrado

    await expect(
      listUserService.execute(
        { name: 'User', email: 'example.com', justActive: true },
        { nameOrder: 'ASC', createOrder: 'DESC', deleteOrder: 'ASC' },
        { page: 1, limit: 10 },
      ),
    ).rejects.toThrow(AppError);

    expect(User.count).toHaveBeenCalledWith({
      where: {
        name: { [Op.like]: '%User%' },
        email: { [Op.like]: '%example.com%' },
      },
      paranoid: true,
    });

    expect(User.findAll).not.toHaveBeenCalled();
  });

  it('deve aplicar paginação corretamente', async () => {
    const usersMock = [
      { id: 'user1', name: 'User One', email: 'userone@example.com' },
    ];

    (User.count as jest.Mock).mockResolvedValue(15); // Simula 15 usuários no total
    (User.findAll as jest.Mock).mockResolvedValue(usersMock); // Simula a busca de usuários

    const result = await listUserService.execute(
      { name: undefined, email: undefined, justActive: false },
      { nameOrder: 'ASC', createOrder: 'DESC', deleteOrder: 'ASC' },
      { page: 2, limit: 10 },
    );

    expect(User.count).toHaveBeenCalledWith({
      where: {},
      paranoid: false,
    });

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: { exclude: ['password'] },
      where: {},
      paranoid: false,
      order: [
        ['name', 'ASC'],
        ['createdAt', 'DESC'],
        ['deletedAt', 'ASC'],
      ],
      raw: true,
      offset: 10,
      limit: 10,
    });

    expect(result).toEqual({
      users: usersMock,
      pages: 2,
    });
  });
});
