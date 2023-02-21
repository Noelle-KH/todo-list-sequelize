const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { User } = require('../../models')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    req.flash('warning_message', 'Email and password are required.')
    return res.redirect('/users/login')
  }
  next()
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    let errors = []

    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }

    if (password !== confirmPassword) {
      errors.push({ message: 'Password and confirm password not the same.' })
    }

    if (errors.length) {
      return res.render('register', { name, email, password, confirmPassword, errors })
    }

    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'User is already exist, please use login feature.' })
      return res.render('register', { name, email, password, confirmPassword, errors })
    }

    await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
    req.flash('success_message', 'Register successfully.')
    res.redirect('/users/login')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
