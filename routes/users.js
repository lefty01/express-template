var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


router.get('/', function(req, res, next) {
    res.render('index', {
	title: "user page"
    });
});

module.exports = router;
