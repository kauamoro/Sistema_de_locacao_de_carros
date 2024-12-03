import { Request, Response } from 'express';
import DeleteOrderService from '../services/DeleteOrderService';

export default class DeleteOrderController {
    public async delete(req: Request, res: Response, mockNext: unknown) {
        const { id } = req.params;

        const deleteOrder = new DeleteOrderService();

        await deleteOrder.execute(id);

        return res. status(204).json({});
    }
}
