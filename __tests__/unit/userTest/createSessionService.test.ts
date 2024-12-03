import CreateSessionService from '../../../src/modules/User/services/CreateSessionService';
import User from '../../../src/modules/User/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/config/auth.ts', () => ({
    jwt: {
        secret: 'test-secret',
        expiresIn: '10m',
    },
}));

jest.mock('../../../src/modules/User/models/User', () => ({
    findOne: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('CreateSessionService', () => {
    const createSessionService = new CreateSessionService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar uma sessão com sucesso', async () => {
        const userMock = {
            id: 'user123',
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test User',
        };

        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('token123');

        const result = await createSessionService.execute({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(User.findOne).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
            raw: true,
        });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            {}, // Payload vazio conforme o serviço
            'test-secret', // Secret mockado
            { expiresIn: '10m', subject: 'user123' }, // Configurações mockadas
        );
        expect(result).toEqual({
            data: {
                id: 'user123',
                name: 'Test User',
                email: 'test@example.com',
            },
            token: 'token123',
        });
    });

    it('deve lançar erro se o usuário não for encontrado', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await expect(
            createSessionService.execute({
                email: 'test@example.com',
                password: 'password123',
            }),
        ).rejects.toThrow(
            'Incorrect email and password combination. Please try again!',
        );
    });

    it('deve lançar erro se a senha estiver incorreta', async () => {
        const userMock = {
            id: 'user123',
            email: 'test@example.com',
            password: 'hashedPassword',
        };

        (User.findOne as jest.Mock).mockResolvedValue(userMock);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(
            createSessionService.execute({
                email: 'test@example.com',
                password: 'wrongPassword',
            }),
        ).rejects.toThrow(
            'Incorrect email and password combination. Please try again!',
        );
    });
});
