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
    if(req.session.loggedIn === true){
	res.render('user-page', {
	    title: req.session.user.name,
	    name: req.session.user.name,
	    email: req.session.user.email,
	    userID: req.session.user._id
	});
    }else{
	res.redirect('/user/login');
    }
});

router.get('/login', function(req, res, next) {
    res.render('login-form', {title: 'Log in'});
});


//app.use('/login', user.login);          // Edit current user form
//app.post('/login', user.doLogin);       // Edit current user action


module.exports = router;
