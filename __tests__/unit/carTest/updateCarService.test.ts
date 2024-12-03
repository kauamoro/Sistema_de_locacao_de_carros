import UpdateCarService from '../../../src/modules/car/services/updateCarService';
import Car from '../../../src/modules/car/models/car.model';

jest.mock('../../../src/modules/car/models/car.model', () => ({
  findOne: jest.fn(),
}));

describe('UpdateCarService', () => {
  const updateCarService = new UpdateCarService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o carro não for encontrado', async () => {
    (Car.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      updateCarService.execute('nonexistent-id', {}),
    ).rejects.toThrow('Car not found');
  });

  it('deve lançar erro ao tentar atualizar um carro com status "deleted"', async () => {
    const carMock = { id: 'car123', status: 'deleted', update: jest.fn() };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    await expect(
      updateCarService.execute('car123', { status: 'active' }),
    ).rejects.toThrow('Cannot update a car with status deleted');
  });

  it('deve lançar erro para status inválido', async () => {
    const carMock = { id: 'car123', status: 'active', update: jest.fn() };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    await expect(
      updateCarService.execute('car123', { status: 'invalid-status' as unknown as 'active' | 'inactive' }),
    ).rejects.toThrow('Status can only be updated to active or inactive');
  });

  it('deve lançar erro para itens duplicados ou excedendo o limite', async () => {
    const carMock = { id: 'car123', status: 'active', update: jest.fn() };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    await expect(
      updateCarService.execute('car123', { items: ['item1', 'item1'] }),
    ).rejects.toThrow('Items must be unique and cannot exceed five.');

    await expect(
      updateCarService.execute('car123', {
        items: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'],
      }),
    ).rejects.toThrow('Items must be unique and cannot exceed five.');
  });

  it('deve lançar erro para ano inválido', async () => {
    const carMock = { id: 'car123', status: 'active', update: jest.fn() };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    await expect(
      updateCarService.execute('car123', { year: new Date().getFullYear() - 12 }),
    ).rejects.toThrow('The year of the car must be within the last 11 years.');
  });

  it('deve lançar erro para placa duplicada', async () => {
    const carMock = { id: 'car123', status: 'active', update: jest.fn() };
    const existingCarMock = { id: 'car456', status: 'active' };
    (Car.findOne as jest.Mock).mockResolvedValueOnce(carMock);
    (Car.findOne as jest.Mock).mockResolvedValueOnce(existingCarMock);

    await expect(
      updateCarService.execute('car123', { plate: 'ABC-1234' }),
    ).rejects.toThrow('A car with this plate already exists.');
  });

  it('deve atualizar o carro com sucesso', async () => {
    const carMock = { id: 'car123', status: 'active', update: jest.fn() };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    const updatedData = {
      plate: 'ABC-1234',
      brand: 'Brand',
      model: 'Model',
      km: 1000,
      year: new Date().getFullYear(),
      items: ['item1', 'item2'],
      price: 50000,
      status: 'active' as 'active' | 'inactive',
    };

    await updateCarService.execute('car123', updatedData);

    expect(carMock.update).toHaveBeenCalledWith(updatedData);
  });
});
