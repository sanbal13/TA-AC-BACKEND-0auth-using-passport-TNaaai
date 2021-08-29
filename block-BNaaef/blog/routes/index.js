const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (_req, res, _next) => {
  res.render('index');
});
// eslint-disable-next-line no-unused-vars
router.get('/about', (_req, res, _next) => {
  res.render('about');
});
// eslint-disable-next-line no-unused-vars
router.get('/contact', (_req, res, _next) => {
  res.render('contact');
});

// OAuth Authentication
router.get('/success', (req, res) => {
  res.redirect('/articles');
});
router.get('/failure', (req, res) => {
  res.render('failure');
});

// Google Strategy 
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/auth/gmail');

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  }));

// Github Strategy
router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }), (req, res) => {
    res.redirect('/success');
  });

module.exports = router;
