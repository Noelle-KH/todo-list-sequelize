const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return done(null, false, req.flash('warning_message', 'User not exist. Please use register feature.'))
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return done(null, false, req.flash('warning_message', 'Email or password incorrect.'))
    }

    return done(null, user)
  } catch (error) {
    done(error)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findByPk(id)
    user = user.toJSON()
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
