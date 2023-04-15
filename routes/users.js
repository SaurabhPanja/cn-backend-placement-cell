var express = require("express");
var router = express.Router();

const User = require("../models/users");

const passportUtil = require("../middleware/passportUtils");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.user);
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
  if(req.user){
    req.flash("info", "You are already logged in");
    return res.redirect("/users");
  }
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
  if(req.user){
    req.flash("info", "You are already logged in");
    return res.redirect("/users");
  }
  const success = req.flash("success");
  const error = req.flash("error");

  res.render("users/signup", { success: success, error: error });
});

router.post("/signup", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;


  if (!email || !password) {
    req.flash("error", "Please enter all the fields");
    return res.redirect("/users/signup");
  }

  if(email.split("@")[1] !== "codingninjas.com"){
    req.flash("error", "You have to be a codingninjas employee to Sign Up, use your codingninjas.com email id!");
    return res.redirect("/users/signup");
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
      name: name,
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
