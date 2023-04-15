function ensureAuthenticated(req, res, next) {
    return next();
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
}

module.exports = ensureAuthenticated;
