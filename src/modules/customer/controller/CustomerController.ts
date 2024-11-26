import { Request, Response, NextFunction } from 'express';
import CustomerService from '../services/CustomerServices';
import { AppError } from '../../../shared/errors/AppError';

// Controlador para gerenciar operações relacionadas a clientes
class CustomerController {
    // Método para criar um novo cliente
    static async createCustomer(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // Chama o serviço para criar um cliente com os dados do corpo da requisição
            const customer = await CustomerService.createCustomer(req.body);
            return res.status(201).json(customer); // Retorna o cliente criado com status 201
        } catch (error) {
            // Trata erros, utilizando AppError para padronizar a resposta
            if (error instanceof Error) {
                return next(new AppError(error.message, 400)); // Erro do cliente
            } else {
                return next(new AppError('Um erro inesperado ocorreu', 500)); // Erro inesperado
            }
        }
    }

    // Método para buscar um cliente pelo ID
    static async getCustomerById(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // Chama o serviço para obter um cliente pelo ID
            const customer = await CustomerService.getCustomerById(
                req.params.id,
            );
            return res.status(200).json(customer); // Retorna o cliente encontrado com status 200
        } catch (error) {
            // Tratamento de erro semelhante ao método anterior
            if (error instanceof Error) {
                return next(new AppError(error.message, 404)); // Cliente não encontrado
            } else {
                return next(new AppError('Um erro inesperado ocorreu', 500));
            }
        }
    }

    // Método para obter uma lista de clientes com suporte a paginação e filtros
    static async getCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            // Extração de parâmetros de consulta e definição de valores padrão
            const { page, limit, nome, cpf, email } = req.query;
            const query = {
                page: parseInt(page as string, 10) || 1,
                limit: parseInt(limit as string, 10) || 10,
                nome: (nome as string) || undefined,
                cpf: (cpf as string) || undefined,
                email: (email as string) || undefined,
            };
            const result = await CustomerService.getCustomers(query); // Chama o serviço para obter clientes
            return res.status(200).json(result); // Retorna a lista de clientes
        } catch (error) {
            // Tratamento de erro padronizado
            if (error instanceof Error) {
                return next(new AppError(error.message, 500));
            } else {
                return next(new AppError('Um erro inesperado ocorreu', 500));
            }
        }
    }

    // Método para atualizar os dados de um cliente
    static async updateCustomer(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const customer = await CustomerService.updateCustomer(
                req.params.id,
                req.body,
            ); // Atualiza o cliente
            return res.status(200).json(customer); // Retorna o cliente atualizado
        } catch (error) {
            // Tratamento de erro semelhante aos métodos anteriores
            if (error instanceof Error) {
                return next(new AppError(error.message, 400)); // Erro do cliente
            } else {
                return next(new AppError('Um erro inesperado ocorreu', 500));
            }
        }
    }

    // Método para excluir um cliente
    static async deleteCustomer(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const customer = await CustomerService.deleteCustomer(
                req.params.id,
            ); // Exclui o cliente
            return res
                .status(200)
                .json({ message: 'Cliente excluído com sucesso', customer }); // Retorna mensagem de sucesso
        } catch (error) {
            // Tratamento de erro padronizado
            if (error instanceof Error) {
                return next(new AppError(error.message, 404)); // Cliente não encontrado
            } else {
                return next(new AppError('Um erro inesperado ocorreu', 500));
            }
        }
    }
}

export default CustomerController; // Exporta o controlador para uso em outras partes da aplicação
