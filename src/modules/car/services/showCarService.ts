import { AppError } from '../../../shared/errors/AppError';
import Car from '../models/car.model';

export default async function getCarById(id: string) {
    const car = await Car.findByPk(id);
    if (!car) throw new AppError('Car not found');
    return car;
}
