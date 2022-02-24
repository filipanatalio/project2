const router = require("express").Router();

const {default: axios} = require("axios");

/* GET home page */

// Basis API connection, should be moved elsewhere
router.get("/", async (req, res, next) => {
  try {
    res.render("index");
  } catch (e) {
    console.log("error occurred", e)
  }
});


module.exports = router;
