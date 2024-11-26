import Car from '../models/car.model';
import { AppError } from '../../../shared/errors/AppError';

interface IUpdatedProperties {
    plate?: string;
    brand?: string;
    model?: string;
    km?: number;
    year?: number;
    items?: string[];
    price?: number;
    status?: 'active' | 'inactive';
}

export default class UpdateCarService {
    public async execute(
        id: string,
        {
            plate,
            brand,
            model,
            km,
            year,
            items,
            price,
            status,
        }: IUpdatedProperties,
    ): Promise<void> {
        const car = await Car.findOne({ where: { id } });
        if (!car) {
            throw new AppError('Car not found', 404);
        }

        if (car.status === 'deleted') {
            throw new AppError('Cannot update a car with status deleted', 400);
        }

        if (status && status !== 'active' && status !== 'inactive') {
            throw new AppError(
                'Status can only be updated to active or inactive',
                400,
            );
        }

        if (items) {
            if (items.length > 5 || new Set(items).size !== items.length) {
                throw new AppError(
                    'Items must be unique and cannot exceed five.',
                    400,
                );
            }
        }

        if (year && year < new Date().getFullYear() + 1 - 11) {
            throw new AppError(
                'The year of the car must be within the last 11 years.',
                400,
            );
        }

        if (plate) {
            const existingCar = await Car.findOne({
                where: { plate, status: ['active', 'inactive'] },
            });
            if (existingCar && existingCar.id !== id) {
                throw new AppError(
                    'A car with this plate already exists.',
                    400,
                );
            }
        }

        const updatedValues: IUpdatedProperties = {};
        if (plate) updatedValues.plate = plate;
        if (brand) updatedValues.brand = brand;
        if (model) updatedValues.model = model;
        if (km) updatedValues.km = km;
        if (year) updatedValues.year = year;
        if (items) updatedValues.items = items;
        if (price) updatedValues.price = price;
        if (status) updatedValues.status = status;

        await car.update(updatedValues);
    }
}
