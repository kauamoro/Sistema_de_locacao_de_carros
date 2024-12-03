import deleteCar from '../../../src/modules/car/services/deleteCarService';
import Car from '../../../src/modules/car/models/car.model';

jest.mock('../../../src/modules/car/models/car.model.ts', () => ({
  findByPk: jest.fn(),
}));

describe('deleteCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve deletar um carro com sucesso', async () => {
    // Mock do carro encontrado
    const carMock = {
      id: '123',
      destroy: jest.fn(), // Mock do método destroy
    };

    (Car.findByPk as jest.Mock).mockResolvedValue(carMock);

    const result = await deleteCar('123'); // Chama a função com o id mockado

    // Verifica o resultado esperado
    expect(result).toEqual({ message: 'Car deleted successfully' });

    // Verifica se findByPk foi chamado corretamente
    expect(Car.findByPk).toHaveBeenCalledTimes(1);
    expect(Car.findByPk).toHaveBeenCalledWith('123');

    // Verifica se destroy foi chamado
    expect(carMock.destroy).toHaveBeenCalledTimes(1);
  });

  it('deve lançar um erro se o carro não for encontrado', async () => {
    // Mock do carro não encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(null);

    // Verifica se lança o erro correto
    await expect(deleteCar('123')).rejects.toThrow('Car not found');

    // Verifica se findByPk foi chamado corretamente
    expect(Car.findByPk).toHaveBeenCalledTimes(1);
    expect(Car.findByPk).toHaveBeenCalledWith('123');
  });
});
