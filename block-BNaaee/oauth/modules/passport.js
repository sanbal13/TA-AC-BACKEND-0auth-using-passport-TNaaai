/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const LocalUser = require('../models/LocalUser');

passport.use(new LocalStrategy(
  (username, password, done) => {
     LocalUser.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // compare password
      user.verifyPassword(password, (err, result) => {
        if (err) return done(err);
        if (!result) {         
          return done(err);
        }
        // persist logged in user information
        return done(null, user);
      });
    });
  },
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true,
},
(request, accessToken, refreshToken, profile, done) => {
  const profileData = {
    email: profile._json.email,
    name: profile._json.name,
    username: profile._json.username,
    photo: profile._json.picture,
  };

  // eslint-disable-next-line consistent-return
  User.findOne({ email: profileData.email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      // eslint-disable-next-line no-shadow
      User.create(profileData, (err, addedUser) => {
        if (err) {
          return done(err);
        }
        return done(null, addedUser);
      });
    } else {
      return done(null, user);
    }
  });
}));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const profileData = {
        email: profile._json.email,
        name: profile.displayName,
        username: profile.username,
        photo: profile._json.avatar_url,
      };

      // eslint-disable-next-line consistent-return
      User.findOne({ email: profileData.email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          // eslint-disable-next-line no-shadow
          User.create(profileData, (err, addedUser) => {
            if (err) {
              return done(err);
            }
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
