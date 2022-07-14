const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;
  const newUser = User({username, email});
  newUser.register(newUser, password);
});

module.exports = router;