import CreateUserService from '../../../src/modules/User/services/CreateUserService';
import User from '../../../src/modules/User/models/User';
import { hash } from 'bcryptjs';
import { AppError } from '../../../src/shared/http/errors/AppError';

jest.mock('../../../src/modules/User/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('CreateUserService', () => {
  const createUserService = new CreateUserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um usuário com sucesso', async () => {
    const userMock = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(null); // Simula que o e-mail não está em uso
    (hash as jest.Mock).mockResolvedValue('hashedPassword'); // Simula o hashing da senha
    (User.create as jest.Mock).mockResolvedValue(userMock); // Simula a criação do usuário

    const result = await createUserService.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(hash).toHaveBeenCalledWith('password123', 8);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    expect(result).toBe('user123'); // Verifica se o ID do usuário criado é retornado
  });

  it('deve lançar um erro se o e-mail já estiver em uso', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true); // Simula que o e-mail já está em uso

    await expect(
      createUserService.execute({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(AppError);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(User.create).not.toHaveBeenCalled(); // Verifica que o usuário não foi criado
  });
});
