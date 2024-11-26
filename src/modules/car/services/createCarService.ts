import { AppError } from '../../../shared/errors/AppError';
import Car from '../models/car.model';
import { v4 as uuidv4 } from 'uuid';

interface CarData {
    plate: string;
    brand: string;
    model: string;
    km: number;
    year: number;
    items: string[];
    price: number;
    status: 'active' | 'inactive' | 'deleted';
}

export default async function createCar(data: CarData) {
    const { plate, brand, model, km, year, items, price, status } = data;

    if (!plate || !brand || !model || !year || !items || !price || !status) {
        throw new AppError('All required fields must be filled.');
    }
    if (items.length > 5 || new Set(items).size !== items.length) {
        throw new AppError('Items must be unique and cannot exceed five.');
    }
    if (year < new Date().getFullYear() + 1 - 11) {
        throw new AppError(
            'The year of the car must be within the last 11 years.',
        );
    }

    const existingCar = await Car.findOne({
        where: { plate, status: ['active', 'inactive'] },
    });
    if (existingCar) {
        throw new AppError('A car with this plate already exists.');
    }

    const newCar = await Car.create({
        id: uuidv4(),
        plate,
        brand,
        model,
        km,
        year,
        items,
        price,
        registrationDate: new Date(),
        status,
    });

    return newCar;
}
