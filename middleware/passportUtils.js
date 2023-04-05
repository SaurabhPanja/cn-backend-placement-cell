const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/users");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      return user.comparePassword(password, done);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;