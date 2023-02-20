const router = require('express').Router()
const users = require('./modules/users')

router.use('/users', users)
router.get('/', (req, res) => res.redirect('/users/login'))

module.exports = router
