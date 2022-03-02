const passport = require("passport");
const LocalStrategy = require("passport-local");
const { validPassword } = require("../lib/passwordUtil");

const UserModel = require("../models/user");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (username, password, done) => {
  UserModel.findOne({ email: username })
    .then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username or password.",
        });

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err));
};

const strategy = new LocalStrategy(customFields, verifyCallback);

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(strategy);

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((userId, done) => {
    UserModel.findById(userId)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  return passport;
};
