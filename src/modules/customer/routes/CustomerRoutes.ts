// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Router } from 'express';
import CustomerController from '../controller/CustomerController';
import auth from '../../../shared/http/middlewares/isAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

// Validações para criação de clientes
const createCustomerValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(), // Nome completo obrigatório
        dataNascimento: Joi.date().required(), // Data de nascimento obrigatória
        cpf: Joi.string().length(11).required(), // CPF obrigatório (considerando que você irá validar o CPF depois)
        email: Joi.string().email().required(), // E-mail obrigatório
        telefone: Joi.string().required(), // Telefone obrigatório
        createdAt: Joi.date().default(Date.now), // Data do Cadastro padrão para agora
        updatedAt: Joi.date().default(Date.now),
        deletedAt: Joi.date().allow(null), // Data de exclusão pode ser nula
    }),
});

// Validações para atualização de clientes
const updateCustomerValidation = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().guid().required(), // ID do cliente obrigatório
    }),
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().optional(),
        dataNascimento: Joi.date().optional(),
        cpf: Joi.string().length(11).optional(),
        email: Joi.string().email().optional(),
        telefone: Joi.string().optional(),
    }),
});

// Validações para obter um cliente pelo ID
const getCustomerByIdValidation = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().guid().required(), // ID do cliente obrigatório
    }),
});

// Validações para listar clientes (pode incluir parâmetros de consulta)
const listCustomersValidation = celebrate({
    [Segments.QUERY]: Joi.object().keys({
        nome: Joi.string().optional(),
        email: Joi.string().optional(),
        cpf: Joi.string().length(11).optional(),
        excluido: Joi.boolean().optional(),
        pagina: Joi.number().integer().default(1), // Página padrão
        tamanho: Joi.number().integer().default(10), // Tamanho padrão
    }),
});
// middleware de autenticação
router.use(auth);
// Rota para criar um cliente
router.post('/', createCustomerValidation, CustomerController.createCustomer);

// Rota para obter um cliente pelo ID
router.get(
    '/:id',
    getCustomerByIdValidation,
    CustomerController.getCustomerById,
);

// Rota para listar todos os clientes
router.get('/', listCustomersValidation, CustomerController.getCustomers);

// Rota para atualizar um cliente
router.put('/:id', updateCustomerValidation, CustomerController.updateCustomer);

// Rota para deletar um cliente (soft delete)
router.delete(
    '/:id',
    getCustomerByIdValidation,
    CustomerController.deleteCustomer,
);

export default router;
