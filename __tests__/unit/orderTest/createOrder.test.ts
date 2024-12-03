import CreaterOrderService from '../../../src/modules/Order/services/CreaterOrderService';
import Customer from '../../../src/modules/customer/models/Customer';
import Car from '../../../src/modules/car/models/car.model';
import Order from '../../../src/modules/Order/models/Order';
import axios from 'axios';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../../src/modules/car/models/car.model', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../../src/modules/Order/models/Order', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('axios');

describe('CreaterOrderService', () => {
  const createrOrderService = new CreaterOrderService();

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve criar um pedido com sucesso', async () => {
    // Mock do cliente
    const customerMock = { id: 'customer123', email: 'cliente@example.com' };
    (Customer.findOne as jest.Mock).mockResolvedValue(customerMock);

    // Mock do carro
    const carMock = { id: 'car123', plate: 'ABC-1234', price: 100000 };
    (Car.findOne as jest.Mock).mockResolvedValue(carMock);

    // Mock do pedido
    (Order.findOne as jest.Mock).mockResolvedValue(null);
    (Order.create as jest.Mock).mockResolvedValue({
      id: 'order123',
      cliente: customerMock.id,
      CarroPedido: carMock.id,
      ValorTotal: carMock.price,
      status: 'Aberto',
    });

    // Mock da API de CEP
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        uf: 'PE',
        localidade: 'Recife',
        erro: false,
      },
    });

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '50000-000',
    };

    const result = await createrOrderService.execute(orderData);

    expect(Customer.findOne).toHaveBeenCalledWith({ where: { email: orderData.email } });
    expect(Car.findOne).toHaveBeenCalledWith({ where: { plate: orderData.plate } });
    expect(Order.findOne).toHaveBeenCalledWith({
      where: { cliente: customerMock.id, Status: 'Aberto' },
    });
    expect(Order.create).toHaveBeenCalledWith({
      cliente: customerMock.id,
      CarroPedido: carMock.id,
      CEP: orderData.CEP,
      Cidade: 'Recife',
      UF: 'PE',
      ValorTotal: carMock.price,
      dataFinal: null,
      dataCancelamento: null,
      status: 'Aberto',
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: 'order123',
        cliente: customerMock.id,
        CarroPedido: carMock.id,
        ValorTotal: carMock.price,
        status: 'Aberto',
      }),
    );
  });

  it('deve lançar erro se o cliente não for encontrado', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '50000-000',
    };

    await expect(createrOrderService.execute(orderData)).rejects.toThrow('Cliente não encontrado');
  });

  it('deve lançar erro se o carro não for encontrado', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue({ id: 'customer123' });
    (Car.findOne as jest.Mock).mockResolvedValue(null);

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '50000-000',
    };

    await expect(createrOrderService.execute(orderData)).rejects.toThrow('Carro não encontrado');
  });

  it('deve lançar erro se o cliente já tiver pedido em aberto', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue({ id: 'customer123' });
    (Car.findOne as jest.Mock).mockResolvedValue({ id: 'car123' });
    (Order.findOne as jest.Mock).mockResolvedValue({ id: 'order123', Status: 'Aberto' });

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '50000-000',
    };

    await expect(createrOrderService.execute(orderData)).rejects.toThrow(
      'Cliente já possui pedido em aberto',
    );
  });

  it('deve lançar erro para CEP inválido', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue({ id: 'customer123' });
    (Car.findOne as jest.Mock).mockResolvedValue({ id: 'car123' });
    (Order.findOne as jest.Mock).mockResolvedValue(null);

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        erro: true,
      },
    });

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '00000-000',
    };

    await expect(createrOrderService.execute(orderData)).rejects.toThrow('CEP inválido');
  });

  it('deve lançar erro para região não atendida', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue({ id: 'customer123' });
    (Car.findOne as jest.Mock).mockResolvedValue({ id: 'car123' });
    (Order.findOne as jest.Mock).mockResolvedValue(null);

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        uf: 'SP',
        localidade: 'São Paulo',
        erro: false,
      },
    });

    const orderData = {
      email: 'cliente@example.com',
      plate: 'ABC-1234',
      CEP: '50000-000',
    };

    await expect(createrOrderService.execute(orderData)).rejects.toThrow(
      'SP no momento não temos filiais nessa região',
    );
  });
});
