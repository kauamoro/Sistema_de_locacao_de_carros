// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Order from '../models/Order';
import Customer from '../../customer/models/Customer';
import { AppError } from '../../../shared/http/errors/AppError';
import { Model, Op } from 'sequelize';

interface GetOdersParams {
    status?: string;
    CPF?: string;
    DataInicial?: string;
    DataFinal?: string;
    page?: number;
    pageSize?: number;
}

const getOrders = async ({ status, CPF, DataInicial, DataFinal, page, pageSize }: GetOdersParams): Promise <{ totalOrders: number; totalPages: number; orders: Order[] }> => {
    const where: Record<string, unknown >= {};

    const ordenacao = 'ASC';
    const ordem = 'DataInicial';

    if (status) {
        where.status = status;
    }

    if (CPF) {
        const searchCPF = await Customer.findOne({
            where: { CPF }
        })

        where.cliente = searchCPF.id
    }

    if (DataInicial || DataFinal) {
        where.DataInicial = {};
        where.DataFinal = {};

        if (DataInicial) {
            where[DataInicial]= {[Op.gte]: new Date(DataInicial)}
        }

        if (DataFinal) {
            where[DataFinal]= {[Op.lte]: new Date(DataFinal)}
            ordenacao = 'DESC';
            ordem = 'DataFinal';
        }
    }

    const { count, rows } = await Order.findAndCountAll({
        where,
        order: [[ordem, ordenacao]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        attributes:[
            'id', 'status', 'DataInicial', 'DataFinal', 'DataCancelamento', 'ValorTotal','CEP', 'Cidade', 'UF'
        ],
        include: [{
            model: Customer,
            attributes:[
                'id','nome','cpf'
            ]
        }]
    });

    return {
        totalOrders: count,
        totalPages: Math.ceil( count / pageSize ),
        orders: rows,
    };
};

export default{ getOrders};
