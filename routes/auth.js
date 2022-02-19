const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require the Game model in order to interact with the database
const Game = require("../models/Game.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Handles signup routes
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/auth/signup", isLoggedOut, (req, res) => {
  const { username, password, email, age, location, discord } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth.signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          email,
          age, 
          location,
          discord
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

// Handles login routes
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});


router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  
// Will check if user inputed email and password
  if (!email || !password) {
    res.render('auth/login', { errorMessage: 'Please provide both email and password' });
    return;
  }

 // Uses email and uses it to find username, checks if password is correct 

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.render('auth/login', { errorMessage: 'Email not found.' });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.render('website/profile', { user });
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password' });
    }
  });
});

// Handles logout, redirects to index
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});


// Handles profile routing, working partially
router.get('/profile', (req, res, next) => {
  res.render('website/profile');
});

// Handles recommendations
router.get('/recommendations', (req, res, next) => {
  res.render('website/recommendations');
});

// Handles connections
router.get('/connections', (req, res, next) => {
  res.render('website/connections');
});



module.exports = router;