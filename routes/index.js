var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //  res.redirect('/user');
});


// login page
router.get('/login', function(req, res, next) {
    res.render('login-form', {title: 'Log in'});
});

router.post('/login', function(req, res, next){
    if (req.body.Email) {
        User.findOne({'email' : req.body.Email},
                     '_id name email modifiedOn', function(err, user) {
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



module.exports = router;
