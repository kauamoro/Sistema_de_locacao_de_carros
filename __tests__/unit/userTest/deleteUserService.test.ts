import DeleteUserService from '../../../src/modules/User/services/DeleteUserService';
import User from '../../../src/modules/User/models/User';
import { AppError } from '../../../src/shared/http/errors/AppError';

jest.mock('../../../src/modules/User/models/User', () => ({
  findOne: jest.fn(),
  destroy: jest.fn(),
}));

describe('DeleteUserService', () => {
  const deleteUserService = new DeleteUserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve deletar um usuário com sucesso', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true); // Simula que o usuário existe
    (User.destroy as jest.Mock).mockResolvedValue(1); // Simula a deleção do usuário

    await expect(deleteUserService.execute('user123')).resolves.toBeUndefined();

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: 'user123' } });
  });

  it('deve lançar um erro se o usuário não for encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // Simula que o usuário não existe

    await expect(deleteUserService.execute('user123')).rejects.toThrow(AppError);

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user123' } });
    expect(User.destroy).not.toHaveBeenCalled(); // Verifica que o método destroy não foi chamado
  });
});
