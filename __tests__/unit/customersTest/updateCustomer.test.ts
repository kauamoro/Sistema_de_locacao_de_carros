import CustomerService from '../../../src/modules/customer/services/CustomerServices';
import Customer from '../../../src/modules/customer/models/Customer';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  findOne: jest.fn(),
}));

describe('CustomerService - updateCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve atualizar um cliente com sucesso', async () => {
    const customerMock = {
      id: '123',
      nome: 'João Silva',
      email: 'joao@example.com',
      cpf: '12345678901',
      deletedAt: null,
      update: jest.fn(),
    };

    (Customer.findOne as jest.Mock).mockResolvedValue(customerMock);

    const updatedData = { nome: 'João Atualizado', email: 'joao@novoemail.com' };

    const result = await CustomerService.updateCustomer('123', updatedData);

    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { id: '123', deletedAt: null },
    });
    expect(customerMock.update).toHaveBeenCalledWith(updatedData);
    expect(result).toEqual(customerMock);
  });

  it('deve lançar um erro se o cliente não for encontrado', async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      CustomerService.updateCustomer('123', { nome: 'João Atualizado' }),
    ).rejects.toThrow('Cliente não encontrado');
  });
});
