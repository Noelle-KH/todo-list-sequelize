const router = require('express').Router()
const users = require('./modules/users')
const todos = require('./modules/todos')

router.use('/todos', todos)
router.use('/users', users)
router.get('/', (req, res) => res.redirect('/todos'))

module.exports = router
