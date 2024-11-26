import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import DeleteUserService from '../services/DeleteUserService';
import ListUserService from '../services/ListUserService';
import ShowUserService from '../services/ShowUserService';
import UpdateUserService from '../services/UpdateUserService';

interface IFilter {
    name?: string;
    email?: string;
    justActive: boolean;
}

export default class UserController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { name, email, password } = req.body;

        const createUser = new CreateUserService();

        const newUserId = await createUser.execute({ name, email, password });

        return res.status(201).json({ id: newUserId });
    }

    public async List(req: Request, res: Response): Promise<Response> {
        const { name, email, excludeds } = req.query;
        const { nameOrder, createOrder, deleteOrder } = req.query;
        const { page, limit } = req.query;
        let justActive = false;
        console.log(deleteOrder);
        const listUser = new ListUserService();
        if (excludeds === 'no') {
            justActive = true;
        }
        const filter: IFilter = {
            name: (name as string) || undefined,
            email: (email as string) || undefined,
            justActive,
        };
        const order = {
            nameOrder: (nameOrder as string) || 'ASC',
            createOrder: (createOrder as string) || 'DESC',
            deleteOrder: (deleteOrder as string) || 'DESC',
        };

        const paginate = {
            page: parseInt(page as string, 10) || 1,
            limit: parseInt(limit as string, 10) || 10,
        };

        const data = await listUser.execute(filter, order, paginate);

        return res.status(200).json({
            pages: data.pages,
            limitPerPage: parseInt(limit as string, 10) || 10,
            page: page || 1,
            users: data.users,
        });
    }

    public async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const showUser = new ShowUserService();

        const user = await showUser.execute(id);
        return res.status(200).json({ user });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const updateUser = new UpdateUserService();

        await updateUser.execute(id, { name, email, password });

        return res.status(204).json({});
    }

    public async remove(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const deleteUser = new DeleteUserService();

        await deleteUser.execute(id);

        return res.status(204).json({});
    }
}
