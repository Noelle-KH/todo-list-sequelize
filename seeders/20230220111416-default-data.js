'use strict'
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models')
const SEED_USER = {
  id: uuidv4(),
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: SEED_USER.id,
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10)),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    let user = await User.findByPk(SEED_USER.id)
    user = user.toJSON()

    await queryInterface.bulkInsert('Todos', Array.from({ length: 10 }).map((_, i) => ({
      id: uuidv4(),
      name: `name-${i}`,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }), {}))
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Todos', null, {})
  }
}
