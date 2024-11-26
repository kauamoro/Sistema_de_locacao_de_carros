import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.MYSQL_PORT as string, 10),
    },
);

export default sequelize;
