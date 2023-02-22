const router = require('express').Router()
const users = require('./modules/users')
const todos = require('./modules/todos')
const { authenticator } = require('../middleware/auth')

router.use('/todos', authenticator, todos)
router.use('/users', users)
router.get('/', authenticator, (req, res) => res.redirect('/todos'))

module.exports = router
