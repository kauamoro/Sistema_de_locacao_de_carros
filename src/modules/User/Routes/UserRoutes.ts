// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Router } from 'express';
import UserController from '../controllers/UserController';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(isAuthenticated);

userRoutes.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    userController.create,
);

userRoutes.get('/', userController.List);

userRoutes.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    userController.show,
);
userRoutes.patch(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().optional(),
        },
    }),
    userController.update,
);
userRoutes.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    userController.remove,
);

export default userRoutes;
