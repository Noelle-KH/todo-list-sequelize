module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_message', 'Please login.')
    res.redirect('/users/login')
  },
  loginValidator: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('warning_message', 'Email and password are required.')
      return res.redirect('/users/login')
    }
    next()
  }
}