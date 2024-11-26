import { Request, Response } from "express";
import CreaterOrderService from "../services/CreaterOrderService";

export default class CreaterOrderController {
    async createOrder(req: Request, res: Response) {
        const { email, plate, CEP } = req.body;

        const newOrder = new CreaterOrderService();

        const order = await newOrder.execute({ email, plate, CEP });
        res.status(201).json({ order });
    }

}
