import User from '../models/User';
import { AppError } from '../../../shared/errors/AppError';

export default class DeleteUserService {
    public async execute(id: string): Promise<void> {
        const userExists = await User.findOne({ where: { id } });
        if (!userExists) {
            throw new AppError('User not found!', 404);
        }

        await User.destroy({ where: { id } });

        return;
    }
}
