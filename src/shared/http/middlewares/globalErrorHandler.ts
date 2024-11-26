import { AppError } from '../../errors/AppError';
import { NextFunction, Request, Response } from 'express';

export function globalErrorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): Response {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    return res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' });
}
