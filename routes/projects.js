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

module.exports = router;
