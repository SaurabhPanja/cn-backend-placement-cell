var express = require("express");
var router = express.Router();

const ensureAuthenticated = require("../middleware/authenticate");

router.get("/", ensureAuthenticated, function (req, res, next) {
    res.render("students/newStudent", { title: "Students", success: req.flash("success"), error: req.flash("error") });
});

module.exports = router;