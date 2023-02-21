if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
