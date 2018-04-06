const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  User.Model.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    // Return if user not found in database
    if (!user) {
      return done(null, false, {
        message: 'User not found',
      });
    }
    // Return if password is wrong
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Password is wrong',
      });
    }
    // If credentials are correct, return the user object
    return done(null, user);
  });
}));
