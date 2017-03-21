var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');


// PROJECT ROUTES -> was in app.js
// app.get('/project/new', project.create);      // Create new//project form
// app.post('/project/new', project.doCreate);   // Create new//project action
// app.get('/project/:id', project.displayInfo); // Display project//info
// app.get('/project/edit/:id', project.edit);   // Edit selected//project form
// app.post('/project/edit/:id', project.doEdit);// Edit selected//project action
// app.get('/project/delete/:id', project.confirmDelete);// Delete// selected product form
// app.post('/project/delete/:id', project.doDelete);    // Delete//selected project action


router.get('/new', function(req, res, next) {

});
router.post('/new', function(req, res, next) {

});

router.get('/:id', function(req, res, next) {

});

router.get('/edit/:id', function(req, res, next) {

});
router.post('/edit/:id', function(req, res, next) {

});

router.post('/delete/:id', function(req, res, next) {

});
router.post('/delete/:id', function(req, res, next) {

});

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


module.exports = router;
