var express = require("express");
var router = express.Router();

const Interview = require("../models/interviews");
const Student = require("../models/students");

const ensureAuthenticated = require("../middleware/authenticate");

router.get("/new", ensureAuthenticated, function (req, res, next) {
  // Interview.deleteMany({}, function(err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("All documents deleted");
  //     }
  //   });
  res.render("interviews/newInterview", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

router.post("/", ensureAuthenticated, function (req, res, next) {
  var interview = new Interview({
    companyName: req.body["company-name"],
    date: req.body["date"],
  });

  interview.save(function (err, interview) {
    if (err) {
      req.flash("error", "Error in saving interview");
      res.redirect("/interviews/new");
    } else {
      req.flash("success", "Interview saved successfully");
      res.redirect("/interviews");
    }
  });
});

router.get("/", ensureAuthenticated, function (req, res, next) {
  Interview.find({}, function (err, interviews) {
    if (err) {
      req.flash("error", "Error in fetching interviews");
      res.redirect("/interviews/new");
    } else {
      res.render("interviews/interviews", {
        interviews: interviews,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }
  });
});

//see interviewDetail
router.get("/:id", ensureAuthenticated, function (req, res, next) {
  Interview.findById(req.params.id)
    .populate("students")
    .exec(function (err, interview) {
      if (err) {
        req.flash("error", "Error in fetching interview details");
        res.redirect("/interviews/new");
      } else {
        Student.find({}, function (err, students) {
          if (err) {
            req.flash("error", "Error in fetching students");
            res.redirect("/interviews/new");
          } else {
            res.render("interviews/interviewDetail", {
              interview: interview,
              students: students,
              success: req.flash("success"),
              error: req.flash("error"),
            });
          }
        });
      }
    });
});

router.post("/:id/students", ensureAuthenticated, function (req, res, next) {
    Interview.findById(req.params.id, function (err, interview) {
        if (err) {
        req.flash("error", "Error in fetching interview");
        res.redirect("/interviews/new");
        } else {
        Student.findById(req.body["student"], function (err, student) {
            if (err) {
            req.flash("error", "Error in fetching student");
            res.redirect("/interviews/new");
            } else {
            interview.students.push(student);
            interview.save(function (err, interview) {
                if (err) {
                req.flash("error", "Error in saving interview");
                res.redirect("/interviews/new");
                } else {
                req.flash("success", "Student added successfully");
                res.redirect("/interviews/" + interview._id);
                }
            });
            }
        });
        }
    });
});


module.exports = router;
