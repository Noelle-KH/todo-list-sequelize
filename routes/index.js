const router = require('express').Router()
const users = require('./modules/users')
const todos = require('./modules/todos')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.use('/auth', auth)
router.use('/todos', authenticator, todos)
router.use('/users', users)
router.get('/', authenticator, (req, res) => res.redirect('/todos'))
router.use('/', errorHandler)

module.exports = router
