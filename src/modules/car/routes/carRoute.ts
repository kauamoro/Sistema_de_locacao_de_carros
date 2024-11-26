// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Router } from 'express';
import CarController from '../controllers/carController';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';

const carRoute = Router();

carRoute.post('/create', isAuthenticated, CarController.create);
carRoute.get('/', isAuthenticated, CarController.getAll);
carRoute.get('/:id', isAuthenticated, CarController.getById);
carRoute.put('/:id', isAuthenticated, CarController.update);
carRoute.delete('/:id', isAuthenticated, CarController.deleteCar);

export default carRoute;
