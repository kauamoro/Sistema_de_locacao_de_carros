import ShowUserService from '../../../src/modules/User/services/ShowUserService';
import User from '../../../src/modules/User/models/User';
import { AppError } from '../../../src/shared/http/errors/AppError';

jest.mock('../../../src/modules/User/models/User', () => ({
  findOne: jest.fn(),
}));

describe('ShowUserService', () => {
  const showUserService = new ShowUserService();

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve retornar o usuário com sucesso', async () => {
    const userMock = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
    };

    (User.findOne as jest.Mock).mockResolvedValue(userMock); // Simula que o usuário existe

    const result = await showUserService.execute('user123');

    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 'user123' },
      attributes: {
        exclude: ['password'],
      },
    });
    expect(result).toEqual(userMock); // Verifica o retorno esperado
  });

  it('deve lançar um erro se o usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // Simula que o usuário não existe

    await expect(showUserService.execute('user123')).rejects.toThrow(AppError);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: 'user123' },
      attributes: {
        exclude: ['password'],
      },
    });
  });
});
