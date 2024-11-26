import Customer from '../models/Customer'; // Importa o modelo Customer
import { AppError } from '../../../shared/errors/AppError'; // Importa a classe de erro personalizada
import { v4 as uuidv4 } from 'uuid'; // Importa a função para gerar UUIDs
import { Op } from 'sequelize'; // Importa operadores do Sequelize para consultas

// Interface para definir a estrutura dos dados de um cliente
interface ICustomerData {
    nome: string;
    dataNascimento: Date;
    cpf: string;
    email: string;
    telefone: string;
}

// Interface para filtros de busca
interface IFilter {
    nome?: string;
    cpf?: string;
    email?: string;
}

// Interface para paginação
interface IPaginate {
    page: number;
    limit: number;
}

// Interface para a resposta da consulta de clientes
interface IResponse {
    customers: Customer[];
    pages: number;
}

// Interface para filtro com Sequelize
interface IWhereFilter {
    nome?: {
        [Op.like]: string;
    };
    cpf?: {
        [Op.like]: string;
    };
    email?: {
        [Op.like]: string;
    };
}

// Classe de serviço para gerenciar operações relacionadas a clientes
class CustomerService {
    // Método estático para criar um novo cliente
    static async createCustomer(data: ICustomerData): Promise<Customer> {
        // Validação de dados
        const { nome, dataNascimento, cpf, email, telefone } = data;

        if (!nome || !dataNascimento || !cpf || !email || !telefone) {
            throw new AppError('Todos os campos são obrigatórios');
        }

        // Verifica se o cliente já existe
        const existingCustomer = await Customer.findOne({
            where: {
                [Op.or]: [{ cpf }, { email }],
                deletedAt: null, // Considera apenas clientes ativos
            },
        });

        if (existingCustomer) {
            throw new AppError('Cliente com CPF ou email já cadastrado');
        }

        // Criação do cliente
        const customer = await Customer.create({
            id: uuidv4(), // Gerar um UUID para o id
            ...data,
            dataRegistro: new Date(),
        });

        return customer;
    }

    // Método estático para obter um cliente pelo ID
    static async getCustomerById(id: string): Promise<Customer> {
        const customer = await Customer.findOne({
            where: { id, deletedAt: null },
        });

        if (!customer) {
            throw new AppError('Cliente não encontrado');
        }

        return customer;
    }

    // Método estático para obter uma lista de clientes com filtros e paginação
    static async getCustomers(query: IPaginate & IFilter): Promise<IResponse> {
        const { page = 1, limit = 10, ...filters } = query;

        const whereFilter: IWhereFilter = {};
        if (filters.nome) {
            whereFilter.nome = { [Op.like]: `%${filters.nome}%` };
        }
        if (filters.cpf) {
            whereFilter.cpf = { [Op.like]: `%${filters.cpf}%` };
        }
        if (filters.email) {
            whereFilter.email = { [Op.like]: `%${filters.email}%` };
        }

        const countCustomers = await Customer.count({
            where: {
                deletedAt: null,
                ...whereFilter,
            },
        });

        const pages = Math.ceil(countCustomers / limit);
        const customers = await Customer.findAll({
            where: {
                deletedAt: null,
                ...whereFilter,
            },
            limit,
            offset: (page - 1) * limit,
        });

        if (countCustomers === 0) {
            throw new AppError('Nenhum cliente encontrado', 404);
        }

        return {
            customers,
            pages,
        };
    }

    // Método estático para atualizar os dados de um cliente
    static async updateCustomer(
        id: string,
        data: Partial<ICustomerData>,
    ): Promise<Customer> {
        const customer = await Customer.findOne({
            where: { id, deletedAt: null },
        });

        if (!customer) {
            throw new AppError('Cliente não encontrado');
        }

        await customer.update(data);
        return customer;
    }

    // Método estático para deletar um cliente
    static async deleteCustomer(id: string): Promise<Customer> {
        const customer = await Customer.findOne({
            where: { id, deletedAt: null },
        });

        if (!customer) {
            throw new AppError('Cliente não encontrado');
        }

        await customer.update({ deletedAt: new Date() });
        return customer;
    }
}

export default CustomerService; // Exporta a classe CustomerService para uso em outras partes da aplicação
