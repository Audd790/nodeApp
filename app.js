var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require('express-session')
const nocache = require("nocache");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listRouter = require('./routes/list')
var iGraphRouter = require('./routes/infograph')
const { body } = require('express-validator');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 1000  *     60     *   30
  }
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kehadiran/list', listRouter);
app.use('/kehadiran/info', iGraphRouter);

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
