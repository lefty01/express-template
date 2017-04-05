//var moment = require('moment');


$(document).ready(function() {
  var strHTMLOutput = '';
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
            arrLI.push('Time: ' + data[intItem].time + ' Type: ' + data[intItem].startOrEnd);
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

