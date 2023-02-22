const router = require('express').Router()
const authController = require('../../controllers/auth-controller')

router.get('/facebook', authController.facebookLogin)
router.get('/facebook/callback', authController.facebookCallback)

module.exports = router
