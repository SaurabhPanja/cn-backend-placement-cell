var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    console.log(req.user);
    res.send("respond with a resource "+req.flash("success")+" "+req.flash("error")+" "+req.flash("info")+" "+req.flash("warning"));
  });

module.exports = router;