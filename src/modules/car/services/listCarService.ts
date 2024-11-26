import Car from '../models/car.model';

export default async function getAllCars() {
    const cars = await Car.findAll();
    return cars;
}
