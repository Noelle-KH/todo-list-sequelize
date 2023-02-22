const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
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

  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'User is already exist, please use login feature.' })
      return res.render('register', { name, email, password, confirmPassword, errors })
    }

    await User.create({
      id: uuidv4(),
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    })
    req.flash('success_message', 'Register successfully.')
    res.redirect('/users/login')
  } catch (error) {
    console.log(error)
  }
})

router.get('/logout', (req, res) => {
  req.logout(error => {
    if (error) return next(error)

    req.flash('success_message', 'Logout successfully.')
    res.redirect('/users/login')
  })
})

module.exports = router
