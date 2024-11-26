import { AppError } from '../../../shared/errors/AppError';
import User from '../models/User';
import { Op } from 'sequelize';

interface IFilter {
    name?: string;
    email?: string;
    justActive?: boolean;
}

interface IOrder {
    nameOrder: string;
    createOrder: string;
    deleteOrder: string;
}
interface IPaginate {
    page: number;
    limit: number;
}
interface IResponse {
    users: User[];
    pages: number;
}
interface IWhereFilter {
    name?: {
        [Op.like]: string;
    };
    email?: {
        [Op.like]: string;
    };
}
export default class ListUserService {
    public async execute(
        { name, email, justActive }: IFilter,
        { nameOrder, createOrder, deleteOrder }: IOrder,
        { page, limit }: IPaginate,
    ): Promise<IResponse> {
        const whereFilter: IWhereFilter = {};
        if (name) {
            whereFilter.name = { [Op.like]: `%${name}%` };
        }
        if (email) {
            whereFilter.email = { [Op.like]: `%${email}%` };
        }

        const countUsers = await User.count({
            where: { ...whereFilter },
            paranoid: justActive,
        });
        const pages = Math.ceil(countUsers / limit);
        const users = await User.findAll({
            attributes: {
                exclude: ['password'],
            },
            where: { ...whereFilter },
            paranoid: justActive,

            order: [
                ['name', `${nameOrder}`],
                ['createdAt', `${createOrder}`],
                ['deletedAt', `${deleteOrder}`],
            ],

            raw: true,
            offset: page * limit - limit,
            limit: limit,
        });
        if (countUsers == 0) {
            throw new AppError('No results match your search.', 404);
        }
        return { users, pages };
    }
}
