// coding the example project from "mongoose for application development" book

var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require('./model/db');

var routes  = require('./routes/index');
var users   = require('./routes/users');
var project = require('./routes/projects');

var app = express();

var sess = {
    secret: 'hund katze maus',
    cookie: {},
    resave: false,
    saveUninitialized: false
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', users);
app.use('/project', project);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
