//var moment = require('moment');

function padZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


$(document).ready(function() {
  var strHTMLOutput = '';
  var pause = moment.duration("00:50:00");

  $.ajax('/workhours', {
    dataType: 'json',
    error: function() {
      console.log("ajax error :(");
    },
    success: function(data) {
      if (data.length > 0) {
        if (data.status && data.status === 'error') {
          strHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem;
          var totalItems = data.length;
          var arrLI = [];
          var allTimes = {};
          for (intItem = totalItems - 1; intItem >= 0; intItem--) {
// build dict with date 'yyyy-mm-dd' as key and start, start1, start2, ... end, times as value ?!
//          allTimes[data[intItem].time.get]
            // FIXME: use moment here ?!
            var d = new Date(data[intItem].time);
            var date = d.toDateString();
            var h = padZero(d.getHours());
            var m = padZero(d.getMinutes());

            //arrLI.push('Time: ' + data[intItem].time + ' Type: ' + data[intItem].startOrEnd);
            if ("START" === data[intItem].startOrEnd) {
              var starttime = moment(data[intItem].time);
              arrLI.push("START: " + date + " - " + h + ":" + m);
            } else {
              var endtime = moment(data[intItem].time);
              var d = moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause).format("HH:mm");
              var dNoPause = moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");
              arrLI.push("END:&nbsp;&nbsp; " + date + " - " + h + ":" + m + " worktime: " + d);
              console.log("start="+starttime.format("HH:mm")+" - end="+endtime.format("HH:mm")+
                          " diff: " + d + " ("+dNoPause+")");
            }
          }
          strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
        }
      } else {
        strHTMLOutput = "<li>You haven't added any times yet!</li>";
      }
      $('#myworkhours').html(strHTMLOutput);
    }
  });
});

