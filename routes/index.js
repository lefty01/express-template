var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var WorkHour = mongoose.model('WorkHour');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mytime', function(req, res, next) {
  res.render('workhours',
             { title: 'Work Hours',
               name:  'Hallo'
             });
});


// login page
router.get('/login', function(req, res, next) {
  res.render('login-form', {title: 'Log in'});
});

router.post('/login', function(req, res, next){
  if (req.body.Email) { // verify valid email format (abc@x.yy)
    User.findOne(
      {'email' : req.body.Email},
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


router.post('/workhour', function(req, res, nxt) {
  WorkHour.create({
    startOrEnd: req.body.startOrEnd
  }, function(err, newtime) {
       if (err) {
	     console.log("ERROR creating start time");
         res.redirect('/?error=true');
       } else {
	     console.log("time added: " + newtime);
	     res.render('index', { title: 'time added',
                               timeadded: newtime.time
                             });
	   }
     });
});


router.get('/workhours', function(req, res, nxt) {
  console.log('getting all logged working hours');


// find last x days first (eg. last 30 days)
// WorkHour.find( //query today up to tonight
//  { "time" : { "$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})

  // find() ...
  WorkHour.find({ $or: [{'startOrEnd' : 'START'}, {'startOrEnd' : 'END'}]},
                'time startOrEnd',
                { sort: [['time', -1]] },
                function(err, hours) {
                  if (err) {
                    console.log(err);
                    res.json({ "status" : "error", "error" : "error getting times" });
                  } else {
                    console.log(hours);
                    res.json(hours);
                  }
                });
});

module.exports = router;
