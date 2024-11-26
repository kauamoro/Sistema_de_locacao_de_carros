import User from '../models/User';
import { AppError } from '../../../shared/errors/AppError';

export default class ShowUserService {
    public async execute(id: string): Promise<User> {
        const user = await User.findOne({
            where: { id },
            attributes: {
                exclude: ['password'],
            },
        });
        if (!user) {
            throw new AppError('User not found!', 404);
        }

        return user;
    }
}
