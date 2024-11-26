import { Request, Response } from "express";
import ReadAllOrderService from "../services/ReadAllOrderService"
import { AppError } from "../../../shared/errors/AppError";

const ReadAll = async (req: Request, res: Response) => {
    const { status, CPF, DataInicial, DataFinal, page, pageSize } = req.query;

        const orders = await ReadAllOrderService.getOrders ({
            status: status as string | undefined,
            CPF: CPF as string | undefined,
            DataInicial: DataInicial as string | undefined,
            DataFinal: DataFinal as string | undefined,
            page: parseInt(page as string) || 1,
            pageSize: parseInt(pageSize as string) || 10,
        });

        if (orders.totalOrders === 0) {
            throw new AppError('Nem um resultado encontrado', 404);
        }

        return res.status(200).json(orders);
}

export default ReadAll;
