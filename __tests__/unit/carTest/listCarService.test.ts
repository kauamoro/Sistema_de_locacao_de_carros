import getAllCars from '../../../src/modules/car/services/listCarService';
import Car from '../../../src/modules/car/models/car.model';

jest.mock('../../../src/modules/car/models/car.model.ts', () => ({//aq fica o que queremos falsificar, que no caso é o modelo de carro, pois ele faz a interaçao com o banco de dados
  findAll: jest.fn(),// essa funçao tbm falsificamos, pois ela serve para pegar todos os registros(carros) dentro da tabela do banco de dados, que é pega pelo car.models
}));

describe('listCarService', () => { // describre serve para organizar os testes, pois se no codigo tivessemos testando mais outras partes do crud alem de listCar, iriamos "separar" os testes por describes
  beforeEach(() => { // isso serve para repetir determinada funçao para cada test.
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste.
  });

  it('deve retornar uma lista de carros com sucesso', async () => {// it define o teste
    const carsMock = [// Mock da lista de carros, sao carros falsos abaixo. carsMock É a lista simulada de carros que o mock do método findAll retornará.
      {
        id: '123',
        plate: 'ABC-1234',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        km: 10000,
        price: 90000,
        status: 'active',
      },
      {
        id: '456',
        plate: 'DEF-5678',
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        km: 5000,
        price: 110000,
        status: 'inactive',
      },
    ];

    (Car.findAll as jest.Mock).mockResolvedValue(carsMock); //mockResolvedValue: Configura o mock para retornar carsMock quando findAll for chamado.

    const result = await getAllCars(); // Chama a função para listar os carros

    // Verifica se o resultado é o esperado
    expect(result).toEqual(carsMock);

    // Verifica se o método findAll do modelo Car foi chamado exatamente uma vez durante o teste. verifica se findAll foi chamado.
    expect(Car.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar uma lista vazia se não houver carros', async () => {
    // Mock de lista vazia
    (Car.findAll as jest.Mock).mockResolvedValue([]);

    const result = await getAllCars(); // Chama a função para listar os carros

    // Verifica se o resultado é uma lista vazia
    expect(result).toEqual([]);

    // Verifica se findAll foi chamado
    expect(Car.findAll).toHaveBeenCalledTimes(1);
  });
});
