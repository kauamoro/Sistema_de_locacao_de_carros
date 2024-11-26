import User from '../models/User';
import { AppError } from '../../../shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

export default class CreateUserService {
    public async execute({ name, email, password }: IRequest): Promise<string> {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            throw new AppError(
                'An account with this email already exists.',
                409,
            );
        }
        const hashedPassword = await hash(password, 8);

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const id = user.id;

        return id;
    }
}
