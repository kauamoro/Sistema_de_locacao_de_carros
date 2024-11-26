'use strict';
/* eslint-disable */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('customers', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dataNascimento: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            telefone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            dataRegistro: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
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
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('customers');
    },
};
