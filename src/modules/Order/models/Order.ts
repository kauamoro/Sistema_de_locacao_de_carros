import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize';
import  Customer  from "../../customer/models/Customer"
import car from '../../car/models/car.model';

class Order extends Model {
    declare id: string;
    declare cliente: string;
    declare DataInicial: Date;
    declare status: 'Aberto' | 'Aprovado' | 'Cancelado';
    declare CEP: string;
    declare Cidade: string;
    declare UF: string;
    declare ValorTotal: number;
    declare CarroPedido: number;
    declare DataFinal: Date;
    declare DataCancelamento: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        cliente: {
            type: DataTypes.UUID,
            allowNull: false,
             references: {
                model: Customer, // nome do model cliente
                key: 'id'
            }
        },
        DataInicial: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
        status: {
            type: DataTypes.ENUM('Aberto', 'Aprovado', 'Cancelado'),
            allowNull: false,
            defaultValue: 'Aberto',
        },
        CEP: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,

        },
        Cidade: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        UF: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        ValorTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        CarroPedido: {
            type: DataTypes.UUID,
            allowNull: false,
             references: {
                model: car, // nome do model cliente
                key: 'id'
            }
        },
        DataFinal: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
        DataCancelamento: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
    },

    {
        sequelize,
        paranoid: true,
        timestamps: true,
        tableName: 'orders'
    },
);

Order.belongsTo(car, { foreignKey: 'CarroPedido'});
Order.belongsTo(Customer, { foreignKey: 'cliente'});

export default Order;
