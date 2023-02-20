const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User } = require('../../models')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      return res.render('register', { name, email, password, confirmPassword })
    }

    const user = await User.findOne({ where: { email } })
    if (user) {
      return res.render('register', { name, email, password, confirmPassword })
    }
    
    await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
    res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
