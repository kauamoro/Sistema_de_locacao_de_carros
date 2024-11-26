'use strict';
/* eslint-disable */
const { hash } = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [
            {
                name: 'teste',
                email: 'teste@teste.com',
                password: await hash('senha123', 8),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    },
};
