var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var WorkHour = mongoose.model('WorkHour');
var moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");

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
         res.json({ "status" : "success",
                    "startOrEnd" : newtime.startOrEnd,
                    "time": newtime.time});
	     // res.render('index', { title: 'time added',
         //                       timeadded: newtime.time
         //                     });
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

// Read ... (cRud)
router.get('/workhours/:year/:month', function(req, res) {
  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  var startDate = moment([req.params.year, req.params.month - 1]);
  // Clone the value before .endOf()
  var endDate = moment(startDate).endOf('month');
  console.log('getting logged working hours between:');
  console.log(startDate.toDate());
  console.log(endDate.toDate());

  // find all entries for one given month (between first and last day of month)
  // FIXME/TODO: check if we can only return on START/END per day
  // (in case there are more than one START and one END entry ... eg. due to multiple suspend/resume during the day)
  WorkHour.find({
    $and: [
      {
        'time': {
          $gte: startDate.toDate(),
          $lt: endDate.toDate()
        }
      },
      { // ignore any other string for startOrEnd field
        $or: [{'startOrEnd' : 'START'}, {'startOrEnd' : 'END'}]
      }
    ]},
		// only return time and startOrEnd (excluding _id), then sort by time ...
		{'_id': 1, 'time': 1, 'startOrEnd': 1, 'pause': 1 },
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

// Delete ... (cruD)
router.delete('/workhours/:id', function(req, res, next) {
//  if (req.user && (req.user.userid !== 'undefined')) { // => auth!!!
    console.log("deleting: " + req.params.id);

    WorkHour.findByIdAndRemove(req.params.id, function(err, entry) {
      if (err) {
        var resp = {
          message: "error deleting workhour entry!",
          id: entry._id
        };
        // res.status(500).send(err);
      } else {
        var resp = {
          message: "workhour entry deleted",
          timestamp: entry.time,
          id: entry._id
        };
      }
      res.send(resp);
    });
//  }
});


// Update ... (crUd)
router.put('/workhours/:id', function(req, res, next) {
    console.log("updating entry with id: " + req.params.id);

    WorkHour.findByIdAndUpdate(req.params.id, {
	$set: { size: 'large' }}, { new: true }, function (err, tank) {
	    if (err) return handleError(err);
	    res.send(tank);
	});

    
    //WorkHour.update({ _id: id }, { $set: { size: 'large' }}, callback);

});

// Create ... (Crud)
router.post('/workhours/', function(req, res, next) {
    if (req.entry && (req.entry !== 'undefined')) {
	// validate input ...

	WorkHour.save(function (err, data) {
	    if (err) console.log(err);
	    else console.log('Saved ', data);
	});

    }

});


module.exports = router;
