const router = require("express").Router();

const {default: axios} = require("axios");

/* GET home page */

// Basis API connection, should be moved elsewhere
router.get("/", async (req, res, next) => {
  try {
    const request = await axios.get(`https://api.boardgameatlas.com/api/search?name=C&limit=100&client_id=${process.env.CLIENT_ID}`);
    const games = request.data.games
    res.render("index", {games});
  } catch (e) {
    console.log("error occurred", e)
  }
});

const people = [
  { name: 'adri'},
  { name: 'becky'},
  { name: 'chris'},
  { name: 'dillon'},
  { name: 'evan'},
  { name: 'frank'},
  { name: 'georgette'},
  { name: 'hugh'},
  { name: 'igor'},
  { name: 'jacoby'},
  { name: 'kristina'},
  { name: 'lemony'},
  { name: 'matilda'},
  { name: 'nile'},
  { name: 'ophelia'},
  { name: 'patrick'},
  { name: 'quincy'},
  { name: 'roslyn'},
  { name: 'solene'},
  { name: 'timothy'},
  { name: 'uff'},
  { name: 'violet'},
  { name: 'wyatt'},
  { name: 'x'},
  { name: 'yadri'},
  { name: 'zack'},
]




module.exports = router;
