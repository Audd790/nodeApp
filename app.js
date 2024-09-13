var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('node:fs');
var logger = require('morgan');
var session = require('express-session')
const nocache = require("nocache");
var GroupDocs = require('groupdocs-conversion-cloud');
const MSSQLStore = require('connect-mssql-v2');

const config = {
  user: 'auddii',
  password: 'auddii98',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  port: 3600,
  database: 'absenrajawali',
};
// const { check, matchedData,  validationResult } = require('express-validator');
var phpExpress = require('php-express')({
  binPath: 'php'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var iGraphRouter = require('./routes/kehadiran');
var izinRouter = require('./routes/izin');
var psikotesRouter = require('./routes/psikotes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.engine('php', phpExpress.engine);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache());
app.use(session({
  // store: new MSSQLStore(config), // options are optional
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 1000  *     60     *   30 
  }
}));
// app.use(validationResult)
// app.use(check)
// app.use(matchedData)


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kehadiran', iGraphRouter);
app.use('/izin', izinRouter);
app.use('/psikotes', psikotesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  var status
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if(err.sqlState !== undefined){
    if(err.sqlState == 23000){
      res.send({result: 'Tidak ada karyawan tersebut'})
    } else res.send({result: err.sqlMessage, sql: err.sql})
    console.log(err.sqlMessage)
  } else {
    res.status( err.status || 500);
    res.render('error');
  }

  // render the error page
});

module.exports = app;