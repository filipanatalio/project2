const router = require("express").Router();

const {default: axios} = require("axios");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const request = await axios.get(`https://api.boardgameatlas.com/api/search?name=C&limit=100&client_id=${process.env.CLIENT_ID}`);
    const games = request.data.games
    res.render("index", {games});
  } catch (e) {
    console.log("error occurred", e)
  }
});



module.exports = router;
