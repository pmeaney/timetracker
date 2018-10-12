var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const validator = require('express-validator');
const flash = require('express-flash');
const dotenv = require('dotenv').config();
const multer = require('multer'); // file storing middleware

// ############## Knex #####################
const knex = require('knex');
const environment = process.env.NODE_ENV;
const knex_config = require('./knexfile');
const database = require('knex')(knex_config[environment]);

// ############## Session #####################
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const config = require("./config.json");

// ############## Router  #####################
const index_Router = require('./routes/index');
const users_Router = require('./routes/users');
const emp_api_Router = require('./routes/emp_api');
const admin_api_Router = require('./routes/admin_api');

var app = express();

const store = new KnexSessionStore({
  knex: database,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// error reporting
const unhandledError = require("unhandled-error");

const errorReporter = unhandledError((error, context) => {
  console.log('unhandled-error and context is: ', error, context);
});


// begin: stuff for frontend development (webpack)
const isProd = process.env.NODE_ENV === "production"
if (!isProd) {


  const webpack = require("webpack")
  const config = require("../../config/webpack.dev.js")
  const compiler = webpack(config)
  const webpackDevMiddleware = require("webpack-dev-middleware")
  const webpackHotMiddleware = require("webpack-hot-middleware")

  app.use(
    webpackDevMiddleware(compiler, {
      hot: true,
      filename: "main-bundle.js",
      publicPath: "/reactBundles/",
      stats: {
        colors: true
      },
      historyApiFallback: true
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      log: console.log,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000
    })
  );

}
// end: stuff for frontend development (webpack)

const middleware = [
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  validator(),
  express.static(path.join(__dirname, 'public')),
  session({
    secret: config.sessions.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // maxAge: 30 * 60 * 1000 // 30 mins
      // maxAge: 24 * 60 * 60 * 1000 // 1 day
      maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month
    },
    store: store
  }),
  flash()
]

app.use(middleware)

app.use('/', index_Router);
app.use('/users', users_Router);
app.use('/emp_api', emp_api_Router);
app.use('/admin_api', admin_api_Router);

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

console.log('Listening at: http://localhost:3000/')

module.exports = app;
