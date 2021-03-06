const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require the Game model in order to interact with the database
const Game = require("../models/Game.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn")

//axios
const axios = require("axios");

//handle profile routing, automatically searches favorited games in API and mongo and renders it
router.get("/profile", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.currentUser._id).populate("followings gamesWant gamesCreated")

    //create a string var that will include the id of all games to search
    let urlToSearch = `https://api.boardgameatlas.com/api/search?ids=${user.gamesCreated}&client_id=DDJV2RxbFt`;
    //searches API using the var
    const axiosResponse = await axios.get(urlToSearch)
    //filters the data received
    const axiosGames = axiosResponse.data.games;

    //searches mongo
    const mongoResponse =  await Game.find();
    //filters the data received
    const mongoGames = mongoResponse.filter((element) => {
        return element.id === req.query.id;
    })
  
    if (user.gamesCreated.length > 0) {
    res.render("website/profile", { user, axiosGames, mongoResponse });
    }
    else {
    res.render("website/profile", { user, mongoResponse });
    }

  } catch (error) {
  }

});

//Remove games from profile
router.post("/profile/delete/mongo/:id", (req, res, next) => {
  const user = req.session.currentUser._id;
  const deleteGame = req.params.id;
  return User.findByIdAndUpdate(
    user,
    { $pull: { gamesWant: deleteGame } },
    { new: true }
  )
    .then((updatedUser) => {
      res.redirect("/profile");
    });
});

//Remove games from profile
router.post("/profile/delete/:id", (req, res, next) => {
  const user = req.session.currentUser._id;
  const deleteGame = req.params.id;
  return User.findByIdAndUpdate(
    user,
    { $pull: { gamesCreated: deleteGame } },
    { new: true }
  )
    .then((updatedUser) => {
      res.redirect("/profile");
    });
});
  

// Handles connections
router.get("/connections", async (req, res, next) => {
  const username = req.session.currentUser.username;
  let myUserFollowings = [];
  console.log(myUserFollowings);
  let gamesCreated = [];
  let gamesMatch = [];
  //Finding the data of the logged user
  User.findOne({ username })
    .then((logedUser) => {
      // Search the games that the logged user wants to play
      if (logedUser) {
        gamesCreated = logedUser.gamesCreated;
        myUserFollowings = logedUser.followings;
      }
    })
    .then((response1) => {
      // Acessing all users
      User.find()
        .then((allUsers) => {
          if (allUsers) {
            allUsers.forEach((user) => {
              const toNumber = user._id.valueOf();
              console.log(toNumber);

              if (
                username !== user.username &&
                !myUserFollowings.includes(toNumber)
              ) {
                // Matching the logged in user with other users want to play games
                user.gamesCreated.forEach((game) => {
                  // Finding matching games
                  if (gamesCreated.indexOf(game) !== -1) {
                    if (
                      !gamesMatch.find(
                        (element) => element.username === user.username
                      )
                    ) {
                      //console.log(!myUserFollowings.includes(user._id));

                      if (!myUserFollowings.includes(user._id)) {
                        gamesMatch.push(user);
                      }
                    }
                  }
                });
              }

              //  console.log(gamesMatch)
            });

            // console.log("gamesMatch", gamesMatch)
          }
        })
        .then((response) => {
          // console.log(response)
          // console.log("gamesMatch", gamesMatch)
          return res.render("website/connections", { gamesMatch });
        });
    });
});

//Add new friend to our database and prints in the profile page
router.post("/connections/add/:id", (req, res, next) => {
  const newFriend = req.params.id;
  const user = req.session.currentUser._id;

  User.findById(user).then((currentUser) => {
    const currentFriends = currentUser.followings;

    if (currentFriends.includes(newFriend)) {
      console.log("amigo ja existente");
      return false;
    } else {
      console.log("amigo adicionado");

      return User.findByIdAndUpdate(
        user,
        { $push: { followings: newFriend } },
        { new: true }
      )
        .populate("followings")
        .then((updatedUser) => {
          res.redirect("/profile");
        });
    }
  });
});

//Delete friends from profile
router.post("/connections/delete/:id", (req, res, next) => {
  const user = req.session.currentUser._id;
  const deleteUser = req.params.id;
  return User.findByIdAndUpdate(
    user,
    { $pull: { followings: deleteUser } },
    { new: true }
  )
    .populate("followings")
    .then((updatedUser) => {
      res.redirect("/profile");
    });
});

  
  // Handles recommendations and game search
router.get('/recommendations', async (req, res, next) => {

  let urlToSearch = "https://api.boardgameatlas.com/api/search?";
  if (!req.query.game && !req.query.maxPlayer && !req.query.minPlayer && !req.query.maxPlay && !req.query.minAge) {
    return res.render('website/recommendations');
  }
  //if user entered information field, the search will include that value
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

  const axiosResponse = await axios.get(urlToSearch)
  const mongoResponse =  await Game.find();
  
  const axiosGames = axiosResponse.data.games;
  const mongoGames = mongoResponse.filter((element) => {
      return element.name === req.query.game;
  })

  console.log(mongoGames);

  res.render("website/recommendations", {axiosGames, mongoGames})

});

//work in progress bellow, ignore it
/* router.get('/recommendations/search/:id', async (req, res, next) => {

  let urlToSearch = "https://api.boardgameatlas.com/api/search?";
  urlToSearch = urlToSearch.concat(`ids=${req.query.id}&client_id=DDJV2RxbFt`)

  const axiosResponse = await axios.get(urlToSearch)
  const mongoResponse =  await Game.find();
  
  const axiosGames = axiosResponse.data.games;
  const mongoGames = mongoResponse.filter((element) => {
      return element.name === req.query.game;
  })

  console.log(mongoGames);

  res.render("website/recommendations", {axiosGames, mongoGames})

}); */
  
router.post('/recommendations/random', (req, res, next) => {
  axios
    .get(`https://api.boardgameatlas.com/api/search?random=true&client_id=DDJV2RxbFt`)
    .then(response => {
      console.log(response.data.games[0]);
      const axiosGames = response.data.games;    
      return res.render('website/recommendations', {axiosGames});
    });
});

router.post('/recommendation/add-api/:id', (req, res, next) => {
  const gameId = req.params.id
  const currentUser = req.session.currentUser

  User.findById(currentUser._id)
  .then(user => {
    if (user.gamesCreated.includes(gameId)) {
      res.redirect('/recommendations');
    }
    else {
      user.gamesCreated.push(gameId)
      user.save()
      res.redirect('/profile');
    }
  })


    .catch((err) =>
      console.log(
        'Error while adding game to the favorites list: ',
        err
      )
    );

});

//Add game from Mongo to favorite list
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

});

//Add game from API to favorite list
router.post('/recommendations/add-game', (req, res, next) => {
  const { name, description, minPlayer, maxPlayer, rulesUrl, minAge, maxPlay, thumb_url } = req.body;
  const currentUser = req.session.currentUser

  Game.create({ name, description, minPlayer, maxPlayer, rulesUrl, minAge, maxPlay, thumb_url })
  .then( newGame => {
      console.log("New game created: ", newGame);
      return User.findByIdAndUpdate(
          currentUser._id,
          { $push: { gamesWant: newGame._id } },
          { new: true }
        )
  })
  .then(updatedUser => {
    console.log(updatedUser)
    res.redirect('/recommendations');
  })
  .catch(err => console.log('Err while creating new game: ', err));
  //res.render('/recommendations', { errorMessage: 'Incorrect password' });

});

  
  //Delete games that are created by the users
  
  router.post("/recommendations/delete/:id", (req, res, next) => {
    const currentGame = req.params.id;
    // console.log(currentGame)
  Game.findByIdAndRemove(currentGame)

    .then(() => {
      res.redirect('/recommendations');
    })



  }); 

module.exports = router;