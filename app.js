var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

mongoose.connect(
  "mongodb://localhost:27017/auth",
  { useNewUrlParser: true },
  err => console.log(err)
);

db = mongoose.connection;
db.on("error", err => console.log(err));
db.on("open", res => console.log(`conectado`));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err) {
    res.send({ status: 500, data: { msg: err.message } });
  }
  res.send({ status: 200, data: { msg: "Ok" } });
});

module.exports = app;
