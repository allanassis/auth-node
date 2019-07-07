var express = require("express");
var User = require("../models/User");

var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  User.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.send({ status: 500, msg: "ruim" });
    }
    res.send({ status: 200, data: docs });
  });
});

router.post("/", function(req, res, next) {
  const { name, email, password } = req.body;
  const UserInstance = new User({ name, email, password });
  UserInstance.save(err => console.log(err));
  res.send({ status: 201, msg: req.body });
});

module.exports = router;
