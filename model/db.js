var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/mongoosepm';

var userSchema = new mongoose.Schema({
  name: String,
  email: {type: String, unique:true},
  createdOn: { type: Date, default: Date.now },
  modifiedOn: Date,
  lastLogin: Date
});

var projectSchema = new mongoose.Schema({
  projectName: String,
  createdOn: Date,
  modifiedOn: { type: Date, default: Date.now },
  createdBy: String,
  tasks: String
});

// make a connection
mongoose.connect(dbURI);

// Build User and Project models
mongoose.model('User', userSchema);
mongoose.model('Project', projectSchema);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination (SIGINT)');
    process.exit(0);
  });
});

