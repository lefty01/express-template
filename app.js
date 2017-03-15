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

//app.use('/projects', projects);
//app.get('/', routes.index);


// user routes
// app.get('/user', user.index);           // Current user profile
// app.get('/user/new', user.create);      // Create new user form
// app.post('/user/new', user.doCreate);   // Create new user action
// app.get('/user/edit', user.edit);       // Edit current user form
// app.post('/user/edit', user.doEdit);    // Edit current user action
// app.get('/user/delete', user.confirmDelete);       // delete current user form
// app.post('/user/delete', user.doDelete);    // Delete current user action
// app.get('/logout', user.doLogout);          // Logout current user



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
