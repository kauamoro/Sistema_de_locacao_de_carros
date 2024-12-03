import CustomerService from '../../../src/modules/customer/services/CustomerServices';
import Customer from '../../../src/modules/customer/models/Customer';

jest.mock('../../../src/modules/customer/models/Customer', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('CustomerService - createCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('deve criar um cliente com sucesso', async () => {
    const customerData = {
      nome: 'João Silva',
      dataNascimento: new Date('1990-01-01'),
      cpf: '12345678901',
      email: 'joao@example.com',
      telefone: '999999999',
    };

    // Simula que nenhum cliente com o mesmo CPF ou email existe
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    // Simula a criação bem-sucedida do cliente
    (Customer.create as jest.Mock).mockResolvedValue({
      id: '123',
      ...customerData,
      dataRegistro: new Date(),
    });

    const result = await CustomerService.createCustomer(customerData);

    // Verifica se o cliente foi criado corretamente
    expect(Customer.create).toHaveBeenCalledWith(
      expect.objectContaining(customerData),
    );
    expect(result).toEqual(
      expect.objectContaining({ id: '123', ...customerData }),
    );
  });

  it('deve lançar um erro se o cliente já existir', async () => {
    const customerData = {
      nome: 'João Silva',
      dataNascimento: new Date('1990-01-01'),
      cpf: '12345678901',
      email: 'joao@example.com',
      telefone: '999999999',
    };

    // Simula que o cliente já existe
    (Customer.findOne as jest.Mock).mockResolvedValue(customerData);

    // Verifica se o erro é lançado
    await expect(
      CustomerService.createCustomer(customerData),
    ).rejects.toThrow('Cliente com CPF ou email já cadastrado');
  });

  it('deve lançar um erro se faltar algum campo obrigatório', async () => {
    const customerData = {
      nome: '',
      dataNascimento: null,
      cpf: '',
      email: '',
      telefone: '',
    };

    // Verifica se o erro é lançado
    await expect(
      CustomerService.createCustomer(customerData as never),
    ).rejects.toThrow('Todos os campos são obrigatórios');
  });
});
