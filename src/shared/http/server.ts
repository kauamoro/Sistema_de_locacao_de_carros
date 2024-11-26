// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import express from 'express';
import sequelize from '../../config/sequelize';
import cors from 'cors';
import 'express-async-errors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
    res.status(200).send({ message: 'Server is up and running!' });
});
app.use('/api/v1/', routes);

app.use(errors());
app.use(globalErrorHandler);
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
