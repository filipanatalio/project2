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

//axios
const axios = require("axios");

// Handles profile routing, working partially
router.get('/profile', (req, res, next) => {
    res.render('website/profile', { user : req.session.currentUser});
  });
  
  // Handles recommendations
  /* router.get('/recommendations', (req, res, next) => {
    res.render('website/recommendations');
  }); */
  
  // Handles connections
  router.get('/connections', (req, res, next) => {
    res.render('website/connections');
  });
  
  
  // Handles recommendations and game search
  router.get('/recommendations', (req, res, next) => {
    let urlToSearch = "https://api.boardgameatlas.com/api/search?";
    if (!req.query.game && !req.query.maxPlayer && !req.query.minPlayer && !req.query.maxPlay && !req.query.minAge) {
      return res.render('website/recommendations');
    }
    if (req.query.game) {
      urlToSearch = urlToSearch.concat(`&name=${req.query.game}`)
    }
    if (req.query.minPlayer) {
      urlToSearch = urlToSearch.concat(`&min_players=${req.query.minPlayer}`)
    }
    if (req.query.maxPlayer) {
      urlToSearch = urlToSearch.concat(`&max_players=${req.query.maxPlayer}`)
    }
    if (req.query.minAge) {
      urlToSearch = urlToSearch.concat(`&min_age=${req.query.minAge}`)
    }
    if (req.query.maxPlay) {
      urlToSearch = urlToSearch.concat(`&max_playtime=${req.query.maxPlay}`)
    }
    urlToSearch = urlToSearch.concat(`&limit=${req.query.searchNumber}&client_id=DDJV2RxbFt`)
    axios
    .get(urlToSearch)
    .then(response => {
      console.log(response.data.games[0]);
      const gameDetail = response.data.games;    
      return res.render('website/recommendations', {gameDetail});
    });
  
  
  /*   else if (req.query.game) {
      axios
      .get(`https://api.boardgameatlas.com/api/search?name=${req.query.game}&limit=${req.query.searchNumber}&client_id=DDJV2RxbFt`)
      .then(response => {
        console.log(response.data.games[0]);
        const gameDetail = response.data.games;    
        return res.render('website/recommendations', {gameDetail});
  });
    }
    else if (req.query.maxPlayer) {
      axios
      .get(`https://api.boardgameatlas.com/api/search?min_players=${req.query.minPlayer}&max_players=${req.query.maxPlayer}&limit=${req.query.searchNumber}&client_id=DDJV2RxbFt`)
      .then(response => {
        console.log(response.data.games[0]);
        const gameDetail = response.data.games;    
        return res.render('website/recommendations', {gameDetail});
  });
    } */
  });
  
  router.post('/recommendations/random', (req, res, next) => {
    axios
      .get(`https://api.boardgameatlas.com/api/search?random=true&client_id=DDJV2RxbFt`)
      .then(response => {
        console.log(response.data.games[0]);
        const gameDetail = response.data.games;    
        return res.render('website/recommendations', {gameDetail});
      });
  });
  
  router.post('/recommendation/add-wanted/:id', (req, res, next) => {
    const gameId = req.params.id
    const currentUser = req.session.currentUser
  
  
    User.findByIdAndUpdate(
      currentUser._id,
      { $push: { gamesWant: gameId } },
      { new: true }
    )
      .then((updatedUser) => {
        res.redirect('/profile');
      })
      .catch((err) =>
        console.log(
          'Error while adding game to the favorites list: ',
          err
        )
      );
  
    // Game.create({
    //      name: req.query.name,
    //      id: req.query.id
    //    })
    // .then( newGame => {
    //   console.log("New game: ", newGame);
    // } )
    // .catch(err => console.log('Err while creating new game: ', err));
  });

module.exports = router;