#!/usr/bin/nodejs

var moment = require('moment');

// // print process.argv
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });

var starttime = process.argv[2];
var endtime   = process.argv[3];

console.log("start: " + starttime);
console.log("end  : " + endtime);


console.log(moment(endtime).subtract(starttime).format('hh:mm'));

