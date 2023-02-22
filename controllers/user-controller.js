const passport = require('passport')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models')

const userController = {
  loginPage: (req, res) => {
    res.render('login')
  },
  login: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }),
  registerPage: (req, res) => {
    res.render('register')
  },
  register: async (req, res) => {
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
  },
  logout: (req, res) => {
    req.logout(error => {
      if (error) return next(error)

      req.flash('success_message', 'Logout successfully.')
      res.redirect('/users/login')
    })
  }
}

module.exports = userController
