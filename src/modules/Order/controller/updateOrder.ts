import { Request, Response } from "express";
import UpdateOrderService from "../services/UpdateOrderService";

export default class UpdateOrderController {
    async updateOrder(req: Request, res: Response) {
        const { id } = req.params;
        const { DataInicial, DataFinal, CEP, status} = req.body;

       const newUpdate = new UpdateOrderService();

       const order = await newUpdate.execute({id, DataInicial, DataFinal, CEP, status});
       res.status(201).json( order );


    }
}
