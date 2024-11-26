// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { celebrate, Joi, Segments } from 'celebrate';

const sessionRoutes = Router();
const sessionController = new SessionsController();

sessionRoutes.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    sessionController.create,
);

export default sessionRoutes;
