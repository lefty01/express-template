var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');


// router.get('/new', function(req, res, next) {

// });
// router.post('/new', function(req, res, next) {

// });


// router.get('/edit/:id', function(req, res, next) {

// });
// router.post('/edit/:id', function(req, res, next) {

// });

// router.post('/delete/:id', function(req, res, next) {

// });
// router.post('/delete/:id', function(req, res, next) {

// });


// Projects created by a user
router.get('/byuser/:userid', function(req, res, next) {
  console.log("Getting user projects");
  if (req.params.userid) {
    Project.findByUserID(req.params.userid, function(err, projects) {
        if (!err) {
          console.log(projects);
	  res.json(projects);
	} else {
          console.log(err);
	  res.json({ "status" : "error", "error" : "Error finding projects" });
	}
      })
  } else {
    console.log("No user id supplied");
    res.json({ "status" : "error", "error" : "No user id supplied" });
  }
});



// GET project info
router.get('/:id', function(req, res, next) {
  console.log("Finding project _id: " + req.params.id);
  console.log("loggedIn:" + req.session.loggedIn);

  if (req.session.loggedIn != true) {
    res.redirect('/login');
  }
  else {
      //if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    if (req.params.id) {

      Project.findById(req.params.id, function(err, project) {
        if (err) {
          console.log(err);
          res.redirect('/user?404=project');
        } else {
          console.log(project);
          res.render('project-page', {
            title: project.projectName,
            projectName: project.projectName,
            tasks: project.tasks,
            createdBy: project.createdBy,
            projectID: req.params.id
          });
        }
      });
    } else {
      res.redirect('/user');
    }
  }
});



module.exports = router;
