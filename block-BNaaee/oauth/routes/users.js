const express = require('express');
const passport = require('passport');
const LocalUsers = require('../models/LocalUser');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  console.log(req.session, req.user);
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  LocalUsers.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log('User created');
    res.redirect('/');
  });
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/success');
  });

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
