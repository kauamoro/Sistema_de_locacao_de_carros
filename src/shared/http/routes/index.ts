import userRoutes from '../../../modules/User/Routes/UserRoutes';
import sessionRoutes from '../../../modules/User/Routes/SessionRoutes';
import orderRoute from '../../../modules/Order/routes/createOrderRoute';
import carRoute from '../../../modules/car/routes/carRoute';
import customerRoute from '../../../modules/customer/routes/CustomerRoutes';
import { Router } from 'express';

const routes = Router();

routes.use('/login', sessionRoutes);
routes.use('/users', userRoutes);
routes.use('/customers', customerRoute);
routes.use('/cars', carRoute);
routes.use('/Order', orderRoute);

export default routes;
