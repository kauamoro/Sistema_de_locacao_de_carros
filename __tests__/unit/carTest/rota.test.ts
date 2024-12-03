import request from 'supertest';
import express from 'express';
import carRoute from '../../../src/modules/car/routes/carRoute';
import CarController from '../../../src/modules/car/controllers/carController';

// Mock para os métodos do controller
jest.mock('../../../src/modules/car/controllers/carController', () => ({
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    deleteCar: jest.fn(),
}));

// Mock para o middleware isAuthenticated
jest.mock('../../../src/shared/http/middlewares/isAuthenticated.ts', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/cars', carRoute);

describe('Car Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve chamar o método create do controller para a rota POST /cars/create', async () => {
        (CarController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json({ message: 'Car created' });
        });

        const response = await request(app)
            .post('/cars/create')
            .send({ plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Car created' });
        expect(CarController.create).toHaveBeenCalledTimes(1);
    });

    it('deve chamar o método getAll do controller para a rota GET /cars', async () => {
        (CarController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json([{ id: '1', plate: 'ABC-1234' }]);
        });

        const response = await request(app).get('/cars');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: '1', plate: 'ABC-1234' }]);
        expect(CarController.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve chamar o método getById do controller para a rota GET /cars/:id', async () => {
        (CarController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json({ id: '1', plate: 'ABC-1234' });
        });

        const response = await request(app).get('/cars/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: '1', plate: 'ABC-1234' });
        expect(CarController.getById).toHaveBeenCalledTimes(1);
    });

    it('deve chamar o método update do controller para a rota PUT /cars/:id', async () => {
        (CarController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json({ message: 'Car updated' });
        });

        const response = await request(app)
            .put('/cars/1')
            .send({ brand: 'Honda' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Car updated' });
        expect(CarController.update).toHaveBeenCalledTimes(1);
    });

    it('deve chamar o método deleteCar do controller para a rota DELETE /cars/:id', async () => {
        (CarController.deleteCar as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json({ message: 'Car deleted' });
        });

        const response = await request(app).delete('/cars/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Car deleted' });
        expect(CarController.deleteCar).toHaveBeenCalledTimes(1);
    });
});
