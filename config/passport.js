const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['email', 'displayName']
}, async (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json

  try {
    const user = await User.findOne({ where: { email } })
    if (user) return done(null, user)

    const randomPassword = Math.random().toString(36).slice(-8)
    const newUser = await User.create({
      id: uuidv4(),
      name,
      email,
      password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10))
    })
    done(null, newUser)
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
