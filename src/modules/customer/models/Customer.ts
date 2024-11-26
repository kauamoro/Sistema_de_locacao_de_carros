import { DataTypes, Model } from 'sequelize'; // Importação das classes necessárias do Sequelize
import sequelize from '../../../config/sequelize'; // Importa a instância do Sequelize configurada

// Definição da classe Customer, que estende a classe Model do Sequelize
export class Customer extends Model {
    public id!: string; // Identificador único
    public nome!: string; // Nome do cliente
    public dataNascimento!: Date; // Data de nascimento do cliente
    public cpf!: string; // CPF do cliente (deve ser único)
    public email!: string; // Email do cliente (deve ser único)
    public telefone!: string; // Telefone do cliente
    public dataRegistro!: Date; // Data de cadastro do cliente
    public createdAt!: Date; // Data de criação do registro
    public updatedAt!: Date; // Data da última atualização do registro
    public deletedAt!: Date | null; // Data de exclusão, pode ser nula
}

// Inicialização do modelo Customer
Customer.init(
    {
        id: {
            type: DataTypes.UUID, // Tipo de dado UUID para o ID
            defaultValue: DataTypes.UUIDV4, // Gera um novo UUID por padrão
            primaryKey: true, // Define como chave primária
        },
        nome: { type: DataTypes.STRING, allowNull: false }, // Nome do cliente, não pode ser nulo
        dataNascimento: { type: DataTypes.DATE, allowNull: false }, // Data de nascimento, não pode ser nula
        cpf: { type: DataTypes.STRING, allowNull: false, unique: true }, // CPF, único e não pode ser nulo
        email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Email, único e não pode ser nulo
        telefone: { type: DataTypes.STRING, allowNull: false }, // Telefone, não pode ser nulo
        dataRegistro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Data de registro, valor padrão é a data atual
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Data de criação, valor padrão é a data atual
        updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Data de atualização, valor padrão é a data atual
        deletedAt: { type: DataTypes.DATE, allowNull: true }, // Data de exclusão, pode ser nula
    },
    {
        sequelize, // Instância do Sequelize
        tableName: 'customers', // Nome da tabela no banco de dados
        paranoid: true, // Habilita o soft delete
        timestamps: true, // Habilita as colunas createdAt e updatedAt
    },
);

export default Customer; // Exporta o modelo Customer para uso em outras partes da aplicação
