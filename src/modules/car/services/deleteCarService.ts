import { AppError } from '../../../shared/errors/AppError';
import Car from '../models/car.model';

export default async function deleteCar(id: string) {
    const car = await Car.findByPk(id);
    if (!car) throw new AppError('Car not found');

    await car.destroy();
    return { message: 'Car deleted successfully' };
}
