import { Request, Response } from "express";
import ReadOrderService from "../services/ReadOrderService"

export default class ReadOrderController {
    public async readOrder(req: Request, res: Response) {
        const { id } = req.params;

        const newRead = new ReadOrderService();

        const read = await newRead.execute( id );
       res.status(200).json([ read ])

    }
}
