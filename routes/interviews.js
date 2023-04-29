var express = require("express");
var router = express.Router();

const json2csv = require('json2csv').parse;

const Interview = require("../models/interviews");
const Student = require("../models/students");
const Result = require("../models/results")

const ensureAuthenticated = require("../middleware/authenticate");

router.get("/new", ensureAuthenticated, function (req, res, next) {
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

router.get("/download-csv", ensureAuthenticated, function (req, res, next) {
  Result.find({})
    .populate("student")
    .populate("interview")
    .exec(function (err, results) {
      if (err) {
        console.log(err);
        req.flash("error", "Error in fetching interview details");
        res.redirect("/interviews/new");
      } else {
         let data = [];
          results.forEach(function(result){
            let temp = {};
            temp.student_id = result.student._id;
            temp.student_name = result.student.name;
            temp.student_college = result.student.college;
            temp.student_status = result.student.placementStatus;
            temp.dsaFinalScore = result.student.dsaFinalScore;
            temp.webDFinalScore = result.student.webdFinalScore;
            temp.reactFinalScore = result.student.reactFinalScore;
            temp.interview_date = result.interview.date;
            temp.interview_company = result.interview.companyName;
            temp.interview_student_result = result.status;

            data.push(temp);
          });
        
        const csv =  json2csv(data);

        res.setHeader("Content-disposition", "attachment; filename=results.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
      }
    });
});

//see interviewDetail
router.get("/:id", ensureAuthenticated, function (req, res, next) {
  Result.find({ interview: req.params.id})
    .populate("student")
    .populate("interview")
    .exec(function (err, results) {
      if (err) {
        req.flash("error", "Error in fetching interview details");
        res.redirect("/interviews/new");
      } else {
        Student.find({}, function (err, students) {
          if (err) {
            req.flash("error", "Error in fetching students");
            res.redirect("/interviews/new");
          } else {
            // remove students from the list who are already in the interview
            students = students.filter(function (student) {
              return !results.some(function (result) {
                return result.student._id.equals(student._id);
              });
            });

            Interview.findById(req.params.id, function (err, interview) {
              if (err) {
                req.flash("error", "Error in fetching interview");
                res.redirect("/interviews/new");
              } else {
                res.render("interviews/interviewDetail", {
                  interview: interview,
                  results: results,
                  students: students,
                  success: req.flash("success"),
                  error: req.flash("error"),
                });
              }
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
                  Result.create({
                    status: "Pending",
                    student: student._id,
                    interview: interview._id,
                  }, function (err, result) {
                    if (err) {
                      req.flash("error", "Error in saving result");
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
        }
    });
});

router.get("/reset/now", ensureAuthenticated, function (req, res, next) {
  Interview.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All documents deleted");
    }
  });
  Student.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All documents deleted");
    }
  });
  Result.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All documents deleted");
    }
  });
  req.flash("success", "All interviews deleted successfully");
  res.redirect("/interviews");
});


router.get("/test/new", ensureAuthenticated, function (req, res, next) {
  Result.find({}).populate("student").exec(function (err, interviews) {
    if (err) {
      req.flash("error", "Error in fetching interviews");
      res.redirect("/interviews/new");
    } else {
      res.json(interviews)
    }
  });
});


module.exports = router;
