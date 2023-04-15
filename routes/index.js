var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.redirect("/students")
});

module.exports = router;
