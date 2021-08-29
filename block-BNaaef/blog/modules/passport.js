const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const OAuthUser = require('../models/OAuthUser');

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => {
  const profileData = {
    email: profile._json.email,
    name: profile._json.name,
    username: profile._json.username,
    photo: profile._json.picture,
  };
  OAuthUser.findOne({ email: profileData.email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      OAuthUser.create(profileData, (err, addedUser) => {
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

// GitHub Strategy
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
      OAuthUser.findOne({ email: profileData.email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          OAuthUser.create(profileData, (err, addedUser) => {
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

// Serializeuser and DeserializeUser methods
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  OAuthUser.findById(id, (err, user) => {
    done(err, user);
  });
});
