var express = require("express");
var router = express.Router();

const passportUtil = require("../middleware/passportUtils");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post(
  "/login",
  passportUtil.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/signup", function (req, res, next) {
  res.render("users/signup");
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

      res.json({ success: true });
    });
  });
});

module.exports = router;
