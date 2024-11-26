import { Request, Response } from 'express';
import createCar from '../services/createCarService';
import getAllCars from '../services/listCarService';
import getCarById from '../services/showCarService';
import updateCar from '../services/updateCarService';
import deleteCar from '../services/deleteCarService';

class CarController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const newCar = await createCar(req.body);
            return res.status(201).json(newCar);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: 'Unknown error occurred.' });
        }
    }

    static async getAll(_req: Request, res: Response): Promise<Response> {
        try {
            const cars = await getAllCars();
            return res.status(200).json(cars);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Unknown error occurred.' });
        }
    }

    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const car = await getCarById(req.params.id);
            return res.status(200).json(car);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(404).json({ message: 'Unknown error occurred.' });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const updateCarService = new updateCar();
            const updatedCar = await updateCarService.execute(
                req.params.id,
                req.body,
            );
            return res.status(200).json({
                message: 'Car updated successfully',
                data: updatedCar,
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: 'Unknown error occurred.' });
        }
    }

    static async deleteCar(req: Request, res: Response): Promise<Response> {
        try {
            const result = await deleteCar(req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(404).json({ message: 'Unknown error occurred.' });
        }
    }
}

export default CarController;
