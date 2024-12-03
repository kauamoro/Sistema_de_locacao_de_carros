import getCarById from '../../../src/modules/car/services/showCarService';
import Car from '../../../src/modules/car/models/car.model';

jest.mock('../../../src/modules/car/models/car.model.ts', () => ({
  findByPk: jest.fn(),
}));

describe('showCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve retornar o carro encontrado pelo ID', async () => {
    // Mock do carro encontrado
    const carMock = {
      id: '123',
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      km: 10000,
      price: 90000,
      status: 'active',
    };

    (Car.findByPk as jest.Mock).mockResolvedValue(carMock);

    const result = await getCarById('123'); // Chama a função com o ID mockado

    // Verifica se o resultado é o carro esperado
    expect(result).toEqual(carMock);

    // Verifica se findByPk foi chamado corretamente
    expect(Car.findByPk).toHaveBeenCalledTimes(1);
    expect(Car.findByPk).toHaveBeenCalledWith('123');
  });

  it('deve lançar um erro se o carro não for encontrado', async () => {
    // Mock do carro não encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(null);

    // Verifica se lança o erro correto
    await expect(getCarById('123')).rejects.toThrow('Car not found');

    // Verifica se findByPk foi chamado corretamente
    expect(Car.findByPk).toHaveBeenCalledTimes(1);
    expect(Car.findByPk).toHaveBeenCalledWith('123');
  });
});
