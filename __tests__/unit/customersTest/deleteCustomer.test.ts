import CustomerService from '../../../src/modules/customer/services/CustomerServices';
import Customer from '../../../src/modules/customer/models/Customer';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  findOne: jest.fn(),
}));

describe('CustomerService - deleteCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve excluir um cliente com sucesso', async () => {
    const customerMock = {
      id: '123',
      nome: 'João Silva',
      deletedAt: null,
      update: jest.fn(),
    };

    (Customer.findOne as jest.Mock).mockResolvedValue(customerMock);

    const result = await CustomerService.deleteCustomer('123');

    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { id: '123', deletedAt: null },
    });
    expect(customerMock.update).toHaveBeenCalledWith({ deletedAt: expect.any(Date) });
    expect(result).toEqual(customerMock);
  });

  it('deve lançar um erro se o cliente não for encontrado', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CustomerService.deleteCustomer('123')).rejects.toThrow(
      'Cliente não encontrado',
    );
  });
});
