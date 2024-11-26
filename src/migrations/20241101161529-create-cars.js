'use strict';
/* eslint-disable */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('cars', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            plate: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            model: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            km: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            items: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            price: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            registrationDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive', 'deleted'),
                allowNull: false,
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
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('cars');
    },
};
