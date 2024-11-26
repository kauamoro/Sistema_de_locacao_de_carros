import sequelize from '../../../config/sequelize';
import { DataTypes, Model } from 'sequelize';

class Car extends Model {
    public id!: string;
    public plate!: string;
    public brand!: string;
    public model!: string;
    public km!: number;
    public year!: number;
    public items!: string[];
    public price!: number;
    public registrationDate!: Date;
    public status!: 'active' | 'inactive' | 'deleted';
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date | null;
}

Car.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        plate: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        km: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isRecentYear(value: number) {
                    const currentYear = new Date().getFullYear();
                    if (value < currentYear - 11) {
                        throw new Error(
                            'O carro não pode ter mais de 11 anos.',
                        );
                    }
                },
            },
        },
        items: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            validate: {
                arrayLength(value: string[]) {
                    if (value.length < 1 || value.length > 5) {
                        throw new Error(
                            'Items must contain between 1 and 5 unique items',
                        );
                    }
                },
                isUnique(value: string[]) {
                    if (new Set(value).size !== value.length) {
                        throw new Error('Items cannot contain duplicates');
                    }
                },
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
            },
        },
        registrationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'deleted'),
            allowNull: false,
        },
    },
    {
        sequelize,
        paranoid: true,
        timestamps: true,
        tableName: 'cars',
    },
);

export default Car;
