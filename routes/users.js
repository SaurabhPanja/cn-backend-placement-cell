var express = require("express");
var router = express.Router();

const User = require("../models/users");

const passportUtil = require("../middleware/passportUtils");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource "+req.flash("success")+" "+req.flash("error")+" "+req.flash("info")+" "+req.flash("warning"));
});

router.get("/all", function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get("/login", function (req, res, next) {
  const success = req.flash("success");
  const error = req.flash("error");

  res.render("users/login", { success: success, error: error });
});

router.post(
  "/login",
  passportUtil.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  function (req, res) {
    req.flash("success", "You have successfully logged in");
    res.redirect("/users");
  }
);

router.get("/signup", function (req, res, next) {
  const success = req.flash("success");
  const error = req.flash("error");

  res.render("users/signup", { success: success, error: error });
});

router.post("/signup", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "You must provide an email and password" });
  }

  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).json({ error: "Email is already in use" });
    }

    const user = new User({
      email: email,
      password: password,
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have successfully signed up");
      res.redirect("/users/login");
    });
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logging out");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
