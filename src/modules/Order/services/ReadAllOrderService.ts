// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Order from '../models/Order';
import Customer from '../../customer/models/Customer';
import { AppError } from '../../../shared/errors/AppError';
import { Op } from 'sequelize';

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

    if (status) {
        where.status = status;
    }

    if (CPF) {
        where.CPF = CPF
    }

    if (DataInicial || DataFinal) {
        where.DataInicial = {};
        where.DataFinal = {};

        if (DataInicial) {
            where.DataInicial[Op.gte] = new Date(DataInicial)
        }

        if (DataFinal) {
            where.DataFinal[Op.lte] = new Date(DataFinal);
        }
    }

    const { count, rows } = await Order.findAndCountAll({
        where,
        order: [['DataInicial', 'ASC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });

    return {
        totalOrders: count,
        totalPages: Math.ceil( count / pageSize ),
        orders: rows,
    };
};

export default{ getOrders};
