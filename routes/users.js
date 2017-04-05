var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


var clearSession = function(req, res, callback){
    req.session.user = {};
    req.session.loggedIn = "";
    callback();
};

router.get('/', function(req, res, next) {
  if (req.session.loggedIn === true) {
    res.render('user-page', {
      title: 'Mongoose Project Management',
      name: req.session.user.name,
      email: req.session.user.email,
      userID: req.session.user._id
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/new', function(req, res, next) {
  res.render('user-form', {
    title: 'Create user',
    buttonText: 'Join!'
  });
});

router.post('/new', function(req, res, next) {
  User.create({
    name: req.body.FullName,
    email: req.body.Email,
    modifiedOn : Date.now(),
    lastLogin : Date.now()
  }, function( err, user ) {
       if (err) {
         console.log(err);
         if (err.code === 11000) {
           res.redirect( '/user/new?exists=true' );
         } else {
           res.redirect('/?error=true');
         }
       }
       else {
         console.log("User created and saved: " + user);
         req.session.user = { "name" : user.name,
                              "email": user.email,
                              "_id"  : user._id };
         req.session.loggedIn = true;
         res.redirect( '/user' );
         // res.render('user-created', { -> display created page, but we redirect
         //	title: 'User created',
         //	username: user.name,
         //	usermail: user.email
         // });
       }
     });
});


module.exports = router;
