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
var d =  moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");

console.log(d);



//var ms = moment(endtime, "YYYY-MM-DD HH:mm").diff(moment(starttime, "YYYY-MM-DD HH:mm"));
//var d = moment.duration(ms);
//var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");


// console.log(moment('Fri, 24 Mar 2017 10:36:12 +0100').format('hh:mm'));
// console.log(moment("2017-03-24 10:01:40").format('hh:mm'));//.tz("Europe/Berlin").format('Z');
// console.log(moment('2017-03-24 10:48').format('hh:mm'));


// example:
// ./subtract-time.js "2017-04-05 08:05" "2017-04-05 17:54"
// 