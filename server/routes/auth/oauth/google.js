const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../../db/models/user');

// collect our google configuration into an object
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  userProfileURL: process.env.USER_PROFILE_URL,
};

router.get('/', (req, res, next) => {
  req.session.state = crypto.randomBytes(32).toString('hex');
  passport.authenticate('google', {
    state: req.session.state,
    scope: 'email',
  })(req, res, next);
});

router.get('/callback', (req, res, next) => {
  if (req.query.state == req.session.state) {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.log(err.name, err.message);
        req.session.errorMessage = `Authentication error [${err.name} - ${
          err.errors[0].message
        }]`;
        return res.redirect('/login');
      }
      if (!user) {
        req.session.errorMessage = `Authentication error (user) [${
          err.name
        } - ${err.errors[0].message}
      ]`;
        return res.redirect('/login');
      }
      req.login(user, loginErr => {
        if (loginErr) {
          req.session.errorMessage = 'Login error - Try again later';
          return res.redirect('/login');
        }
        return res.redirect('/home');
      });
    })(req, res, next);
  } else {
    req.session.errorMessage = 'Authentication error (state) - Try again later';
    return res.redirect('/login');
  }
});

const strategy = new GoogleStrategy(
  googleConfig,
  async (token, refreshToken, profile, done) => {
    const googleId = profile.id;
    const name = profile.displayName;
    const email = profile.emails[0].value;

    try {
      let user = await User.findOne({ where: { googleId: googleId } });

      if (!user) {
        user = await User.create({ name, email, googleId });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

// register strategy with passport
passport.use(strategy);

module.exports = router;
