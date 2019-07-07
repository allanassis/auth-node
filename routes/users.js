var express = require("express");
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var router = express.Router();

/* Verify the token, authorizations. */
router.get("/auth", function(req, res, next) {
  let { authentication } = req.headers;
  authentication = authentication.split(" ")[1];
  jwt.verify(authentication, "teste", (err, decode) => {
    if (err) {
      console.log(err);
      res.send({ status: 500, msg: "ruim" });
    }
    res.send({ status: 200, data: decode });
  });
});

/* Login route */
router.get("/", function(req, res, next) {
  const { email, password } = req.body;
  User.find({ email }, (err, docs) => {
    if (err || !docs[0]) {
      res.send({ status: 500, msg: "ruim" });
    } else {
      const doc = docs[0];

      bcrypt
        .compare(password, doc.password)
        .then(match => {
          if (match) {
            const token = jwt.sign({ name: doc.name, email }, "teste", {
              expiresIn: "24h"
            });
            res.send({ status: 200, data: { token, name: doc.name, email } });
          } else {
            res.send({ status: 500, msg: "ruim" });
          }
        })
        .catch(err => {
          res.send({ status: 500, msg: "ruim" });
        });
    }
  });
});

/*create route*/
router.post("/", function(req, res, next) {
  const { name, email, password } = req.body;
  bcrypt.genSalt(10).then(salt =>
    bcrypt.hash(password, salt).then(hashpass => {
      const UserInstance = new User({ name, email, password: hashpass });
      UserInstance.save((err, doc) => {
        if (err) {
          console.log(err);
          res.send({ status: 500, msg: "error" });
        }
        const token = jwt.sign({ name, email }, "teste", {
          expiresIn: "24h"
        });
        res.send({ status: 201, data: { token, name, email } });
      });
    })
  );
});

module.exports = router;
