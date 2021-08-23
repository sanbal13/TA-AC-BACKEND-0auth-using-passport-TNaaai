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

router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/success');
  });

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/success');
  });

module.exports = router;
