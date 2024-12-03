'use strict';
/* eslint-disable */
const { hash } = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [
            {
                id: '9dd65c08-81f0-4844-a85f-39bd157ee953',
                name: 'teste',
                email: 'teste@teste.com',
                password: await hash('senha123', 8),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    },
};
