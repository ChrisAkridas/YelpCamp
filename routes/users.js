const express = require("express");
const passport = require("passport");
const catchAsync = require('../utils/catchAsync');
const User = require("../models/user");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", catchAsync(async (req, res) => {
  try{
    const { username, email, password } = req.body;
    const newUser = User({ username, email });
    const registeredUser = newUser.register(newUser, password);
    req.flash('success', "Welcome to Yelp Camp");
    res.redirect('/campgrounds');
  }
  catch(e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), async (req, res) => {
  req.flash("success", "Welcome back");
  res.redirect('/campgrounds');
});

module.exports = router;
