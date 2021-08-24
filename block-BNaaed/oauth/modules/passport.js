/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CONSUMER_KEY,
  clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
  callbackURL: '/auth/google/callback',
},
((token, tokenSecret, profile, done) => {
  console.log(profile);
  const profileData = {
    googleId: profile.id,
    name: profile.displayName,
  };
  User.findOne({ googleId: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      User.create(profileData, (err, addedUser) => {
        if (err) {
          return done(err);
        }
        return done(null, addedUser);
      });
    }
    return done(null, user);
  });
})));

passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectURL: '/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
  const profileData = {
    name: profile.displayName,
    username: profile.username,
    email: profile._json.email,
    photo: profile._json.avatar_url,
  };
  User.findOne({ username: profile.username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      User.create(profileData, (err, addedUser) => {
        if (err) {
          return done(err);
        }
        return done(null, addedUser);
      });
    }
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
