import { AppError } from '../../errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../config/auth';

export default function isAuthenticated(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Authorization token is missing!');
    }

    const token = authHeader.split(' ')[1];

    try {
        verify(token, authConfig.jwt.secret);

        return next();
    } catch {
        throw new AppError('Invalid authorization token!');
    }
}
