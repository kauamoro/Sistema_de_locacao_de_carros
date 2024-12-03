import CustomerService from '../../../src/modules/customer/services/CustomerServices';
import Customer from '../../../src/modules/customer/models/Customer';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  count: jest.fn(),
  findAll: jest.fn(),
}));

describe('CustomerService - getCustomers', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve retornar uma lista de clientes com sucesso', async () => {
    const customersMock = [
      { id: '123', nome: 'João Silva', cpf: '12345678901' },
      { id: '124', nome: 'Maria Oliveira', cpf: '98765432100' },
    ];

    (Customer.count as jest.Mock).mockResolvedValue(2);
    (Customer.findAll as jest.Mock).mockResolvedValue(customersMock);

    const result = await CustomerService.getCustomers({ page: 1, limit: 10 });

    expect(Customer.count).toHaveBeenCalled();
    expect(Customer.findAll).toHaveBeenCalled();
    expect(result.customers).toEqual(customersMock);
    expect(result.pages).toBe(1);
  });

  it('deve lançar um erro se nenhum cliente for encontrado', async () => {
    (Customer.count as jest.Mock).mockResolvedValue(0);

    await expect(
      CustomerService.getCustomers({ page: 1, limit: 10 }),
    ).rejects.toThrow('Nenhum cliente encontrado');
  });
});
