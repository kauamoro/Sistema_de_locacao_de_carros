import UpdateUserService from '../../../src/modules/User/services/UpdateUserService';
import User from '../../../src/modules/User/models/User';
import { AppError } from '../../../src/shared/http/errors/AppError';

jest.mock('../../../src/modules/User/models/User', () => ({
  findOne: jest.fn(),
  update: jest.fn(),
}));

describe('UpdateUserService', () => {
  const updateUserService = new UpdateUserService();

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve atualizar o usuário com sucesso', async () => {
    const userMock = { id: 'user123', email: 'test@example.com' };

    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(userMock) // Simula que o usuário existe
      .mockResolvedValueOnce(null); // Simula que o email não está em uso por outro usuário

    (User.update as jest.Mock).mockResolvedValue([1]); // Simula que o update ocorreu com sucesso

    await expect(
      updateUserService.execute('user123', {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword123',
      }),
    ).resolves.toBeUndefined();

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'updated@example.com' } });
    expect(User.update).toHaveBeenCalledWith(
      {
        name: 'Updated Name',
        email: 'updated@example.com',
        password: 'newpassword123',
      },
      { where: { id: 'user123' } },
    );
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // Simula que o usuário não existe

    await expect(
      updateUserService.execute('user123', { name: 'New Name' }),
    ).rejects.toThrow(AppError);

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(User.update).not.toHaveBeenCalled(); // Garante que o update não foi chamado
  });

  it('deve lançar erro se o email já estiver em uso', async () => {
    const userMock = { id: 'user123', email: 'test@example.com' };
    const anotherUserMock = { id: 'user124', email: 'existing@example.com' };

    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(userMock) // Simula que o usuário existe
      .mockResolvedValueOnce(anotherUserMock); // Simula que o email está em uso por outro usuário

    await expect(
      updateUserService.execute('user123', { email: 'existing@example.com' }),
    ).rejects.toThrow(AppError);

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'existing@example.com' } });
    expect(User.update).not.toHaveBeenCalled(); // Garante que o update não foi chamado
  });
});
