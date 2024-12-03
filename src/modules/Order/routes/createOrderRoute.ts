// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Router } from "express";
import CreaterOrderController from "../controller/CreaterOrder";
import ReadOrderController from "../controller/ReadOrder";
import ReadAll from "../controller/ReadAllOrder"
import DeleteOrderController from '../controller/DeleteOrder';
import UpdateOrderController from "../controller/updateOrder";
import isAuthenticated from "../../../shared/http/middlewares/isAuthenticated";

const orderRoute = Router();

    const createrOrderController = new CreaterOrderController();
    const readOrderController = new ReadOrderController();
    const deleteOrderController = new DeleteOrderController();
    const updateOrderController = new UpdateOrderController();
    orderRoute.use(isAuthenticated)

    orderRoute.post('/create', createrOrderController.createOrder);
    orderRoute.get('/:id', readOrderController.readOrder);
    orderRoute.get('/', ReadAll)
    orderRoute.delete('/:id', deleteOrderController.delete);
    orderRoute.patch('/:id', updateOrderController.updateOrder);

export default orderRoute;
