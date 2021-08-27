const express = require('express');

const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
router.get('/success', (req, res) => {
  res.render('success');
});
router.get('/failure', (req, res) => {
  res.render('failure');
});

// Local Strategy
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure',
    failureFlash: true,
  }));

// Google Strategy
router.get('/auth/google',
  passport.authenticate('google', {
    scope:
      ['email', 'profile'],
  }));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  }));

// Github Strategy
router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/success');
  });

module.exports = router;
