var express = require("express");
var router = express.Router();

const Student = require("../models/students");

const ensureAuthenticated = require("../middleware/authenticate");

router.get("/new", ensureAuthenticated, function (req, res, next) {
    res.render("students/newStudent", { title: "Students", success: req.flash("success"), error: req.flash("error") });
});

router.post("/", ensureAuthenticated, function (req, res, next) {
    var student = new Student({
        name: req.body['student-name'],
        college: req.body['college'],
        placementStatus: req.body['placement-status'],
        dsaFinalScore: req.body['dsa-final-score'],
        webDFinalScore: req.body['webd-final-score'],
        reactFinalScore: req.body['react-final-score'],
    });

    student.save(function (err, student) {
        if (err) {
            req.flash("error", "Error in saving student");
            res.redirect("/students/new");
        } else {
            req.flash("success", "Student saved successfully");
            res.redirect("/students/new");
        }
    });
});
        



module.exports = router;