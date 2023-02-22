module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_message', 'Please login.')
    res.redirect('/users/login')
  }
}