import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize';

class User extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize, paranoid: true, tableName: 'users', timestamps: true },
);

export default User;
