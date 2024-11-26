import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import { AppError } from '../../../shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    data: object;
    token: string;
}

export default class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await User.findOne({ where: { email }, raw: true });
        if (!user) {
            throw new AppError(
                'Incorrect email and password combination. Please try again!',
                401,
            );
        }

        const passwordMatchs = await compare(password, user.password);

        if (!passwordMatchs) {
            throw new AppError(
                'Incorrect email and password combination. Please try again!',
                401,
            );
        }
        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        return {
            data,
            token,
        };
    }
}
