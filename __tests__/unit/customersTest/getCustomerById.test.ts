import CustomerService from '../../../src/modules/customer/services/CustomerServices';
import Customer from '../../../src/modules/customer/models/Customer';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  findOne: jest.fn(),
}));

describe('CustomerService - getCustomerById', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve retornar o cliente pelo ID', async () => {
    const customerMock = {
      id: '123',
      nome: 'João Silva',
      cpf: '12345678901',
      email: 'joao@example.com',
      telefone: '999999999',
      deletedAt: null,
    };

    (Customer.findOne as jest.Mock).mockResolvedValue(customerMock);

    const result = await CustomerService.getCustomerById('123');

    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { id: '123', deletedAt: null },
    });
    expect(result).toEqual(customerMock);
  });

  it('deve lançar um erro se o cliente não for encontrado', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CustomerService.getCustomerById('123')).rejects.toThrow(
      'Cliente não encontrado',
    );
  });
});
