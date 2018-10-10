var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("babel-register")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// begin: stuff for frontend development (webpack)
const isProd = process.env.NODE_ENV === "production"
if (!isProd) {
  const webpack = require("webpack")
  const config = require("../../config/webpack.dev.js")
  const compiler = webpack(config)

  const webpackDevMiddleware = require("webpack-dev-middleware")(
    compiler,
    config.devServer
  )

  const webpackHotMiddlware = require("webpack-hot-middleware")(
    compiler,
    config.devServer
  )

  app.use(webpackDevMiddleware)
  app.use(webpackHotMiddlware)
  console.log("Middleware enabled")
}

// const expressStaticGzip = require("express-static-gzip")
// app.use(
//   expressStaticGzip("dist", {
//     enableBrotli: true
//   })
// )
// end: stuff for frontend development (webpack)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
