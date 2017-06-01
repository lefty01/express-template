//var moment = require('moment');
var whichMonth;
var durations = {};

// if integer value i is less then 10 (0..9) add leading zero (00..09)
function padZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


function displayMonthlyStat(month, year) {
  var pause = moment.duration("00:50:00");

  $.ajax('/workhours/' + year + '/' + month, {
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


            // FIXME: use moment here ... get rid of padZero()?!
            var d = new Date(data[intItem].time);
            var date = d.toDateString();
            var h = padZero(d.getHours());
            var m = padZero(d.getMinutes());

            //allTimes[date].starts.push(data[intItem].time)
            //arrLI.push('Time: ' + data[intItem].time + ' Type: ' + data[intItem].startOrEnd);

            if ("START" === data[intItem].startOrEnd) {
              var starttime = moment(data[intItem].time);
              // allTimes[date].starts.push(data[intItem].time)
              arrLI.push("START: " + date + " - " + h + ":" + m);
            } else {
              var endtime = moment(data[intItem].time);
              var dNoPause = moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");
              var d = moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause).format("HH:mm");
              // add durations with/without pause to some global data structure so we can use it to toggle the displayed value
              //

              arrLI.push("END:&nbsp;&nbsp; " + date + " - " + h + ":" + m + " worktime: <span id=\"duration_"+intItem+"\">" + dNoPause + "</span>");
              console.log("item=" + intItem + " start="+starttime.format("HH:mm")+" - end="+endtime.format("HH:mm")+
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

}


// function prevNext(whichMoment, prevNxt) {
//   //alert(thisarg);
//   newMoment = moment(whichMoment).add(prevNxt, 'months');
//   var thisMonth = newMoment.format('M');
//   var thisYear  = newMoment.format('YYYY');
//   console.log("this month: " + thisMonth);
//   console.log("this year: "  + thisYear);
  
// }


$(document).ready(function() {
  var strHTMLOutput = '';
  var thisMoment = moment();
  var thisMonth = thisMoment.format('M');
  var thisYear  = thisMoment.format('YYYY');
  console.log("this month: " + thisMonth);
  console.log("this year: "  + thisYear);

  // view previous or next month
  $("#prevmonth").click(function() {
    //prevNext(thisMonth, -1);
    whichMonth--;
    thisMoment.add(-1, 'M');
    console.log("new month: " + whichMonth);
  });

  $('#nextmonth').click(function() {
    //prevNext(thisMonth, 1);
    whichMonth++;
    thisMoment.add(-1, 'M');
    console.log("new month: " + whichMonth);
  });


  var ckbox = $('#add_pause');
  $('input#add_pause').on('click',function () {
    if ($('#add_pause').is(':checked')) {
      //alert('You have Checked it');
      $("#duration_43").text("checked");
    } else {
      //alert('You Un-Checked it');
      $("#duration_43").text("UN-checked");
    }
  });
  // $('#add_pause').click(function() {
  //   $("#duration_0").text("xxx");
  // });


  displayMonthlyStat(thisMonth, thisYear);

});

