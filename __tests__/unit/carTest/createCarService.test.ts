import createCarService from '../../../src/modules/car/services/createCarService';
import Car from '../../../src/modules/car/models/car.model';
import { StatusType } from '../../../src/modules/car/types/statusTypes';

jest.mock('../../../src/modules/car/models/car.model.ts', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

describe('createCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um carro com sucesso', async () => {
    const carData = {
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      km: 10000,
      price: 90000,
      status: 'active' as StatusType,
      items: ['Airbag', 'Ar-condicionado', 'Direção hidráulica'],
    };

    (Car.findOne as jest.Mock).mockResolvedValue(null);
    (Car.create as jest.Mock).mockResolvedValue({
      ...carData,
      id: '0df0adee-d081-4067-99c4-4c1c061b1e51',
      registrationDate: new Date('2024-11-28T18:21:40.241Z'),
    });

    const result = await createCarService(carData);

    expect(result).toEqual({
      ...carData,
      id: '0df0adee-d081-4067-99c4-4c1c061b1e51',
      registrationDate: new Date('2024-11-28T18:21:40.241Z'),
    });

    expect(Car.findOne).toHaveBeenCalledTimes(1);
    expect(Car.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar um erro se ocorrer falha ao criar o carro', async () => {
    const carData = {
      plate: 'DEF-5678',
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      km: 20000,
      price: 100000,
      status: 'active' as StatusType,
      items: ['GPS', 'Teto solar'],
    };

    (Car.findOne as jest.Mock).mockResolvedValue(null);
    (Car.create as jest.Mock).mockRejectedValue(new Error('Erro ao criar o carro'));

    await expect(createCarService(carData)).rejects.toThrow('Erro ao criar o carro');

    expect(Car.findOne).toHaveBeenCalledTimes(1);
    expect(Car.create).toHaveBeenCalledTimes(1);
  });
});
