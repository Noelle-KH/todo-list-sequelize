'use strict'
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = await queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10)),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    await queryInterface.bulkInsert('Todos', Array.from({ length: 10 }).map((_, i) => ({
      name: `name-${i}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }), {}))

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Todos', null, {})
  }
}
