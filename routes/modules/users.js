const router = require('express').Router()
const userController = require('../../controllers/user-controller')
const { loginValidator } = require('../../middleware/auth')

router.get('/login', userController.loginPage)
router.post('/login', loginValidator, userController.login)
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/logout', userController.logout)

module.exports = router
