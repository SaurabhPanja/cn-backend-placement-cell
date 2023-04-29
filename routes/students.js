var express = require("express");
var router = express.Router();

const Student = require("../models/students");
const Result = require("../models/results")

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
        webdFinalScore: req.body['webd-final-score'],
        reactFinalScore: req.body['react-final-score'],
    });

    student.save(function (err, student) {
        if (err) {
            req.flash("error", "Error in saving student");
            res.redirect("/students/new");
        } else {
            req.flash("success", "Student saved successfully");
            res.redirect("/students");
        }
    });
});

router.get("/", ensureAuthenticated, function (req, res, next) {
    Student.find({}, function (err, students) {
        if (err) {
            req.flash("error", "Error in fetching students");
            res.redirect("/students/new");
        } else {
            res.render("students/students", { title: "Students", students: students, success: req.flash("success"), error: req.flash("error") });
        }
    });
});

router.post("/:studentId/interviews/:interviewId/results", ensureAuthenticated, function (req, res, next) {
    Student.findById(req.params.studentId, function (err, student) {
        if (err) {
            req.flash("error", "Error in fetching student");
            res.redirect("/students");
        } else {
            Result.findOneAndUpdate(
                { student: student._id, interview: req.params.interviewId },
                { status: req.body['status'] },
                function (err, result) {
                if (err) {
                    req.flash("error", "Error in saving result");
                    res.redirect("/students");
                } else {
                    req.flash("success", "Result saved successfully");
                    res.redirect("/interviews/" + req.params.interviewId);
                }
            });
        }
    });
});



module.exports = router;