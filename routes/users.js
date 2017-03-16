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
router.post('/login', function(req, res, next){
    if (req.body.Email) {
        User.findOne({'email' : req.body.Email}, '_id name email modifiedOn', function(err, user) {
            if (!err) {
                if (!user){
                    res.redirect('/login?404=user');
                }else{
                    req.session.user = { "name" : user.name,
                                         "email": user.email,
                                         "_id": user._id };
                    req.session.loggedIn = true;
                    console.log('Logged in user: ' + user);
                    res.redirect('/user');
                }
            } else {
                res.redirect('/login?404=error');
            }
        });
    } else {
        res.redirect('/login?404=error');
    }
});

router.get('/new', function(req, res, next) {
    res.render('user-form', {
        title: 'Create user',
        buttonText: 'Join!'
    });
});

router.post('/new', function(req, res, next) {

});


module.exports = router;
