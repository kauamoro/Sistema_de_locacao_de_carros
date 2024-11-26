'use strict';
/* eslint-disable */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize)  {
    await queryInterface.createTable('orders', {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        cliente: {
            type: Sequelize.UUID,
            allowNull: false,
             references: {
                model: {
                    tableName: 'customers', // nome da tabela no bd
                    },
                key: 'id'
            },
            onUpdate: 'CASCADE', // se o id do cliente mudar, na tablea orders esse id é atualizado
        },
        DataInicial: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
        status: {
            type: Sequelize.ENUM('Aberto', 'Aprovado', 'Cancelado'),
            allowNull: false,
            defaultValue: 'Aberto',
        },
        CEP: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                is: /^\d{5}-?d{3}$/, //validação para o formato
            },
        },
        Cidade: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        UF: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        ValorTotal: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        CarroPedido: {
            type: Sequelize.UUID,
            allowNull: false,
             references: {
                model: { tableName: 'cars' }, // nome da tabela no bd
                key: 'id'
            }
        },
        DataFinal: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
        DataCancelamento: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true, // validação para garantir que seja válida
            },
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
