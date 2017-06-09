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

//   if (db && db !== "null" && db !== "undefined") {

function displayMonthlyStat(month, year) {
  var pause = moment.duration({ minutes: 50});


  $.ajax('/workhours/' + year + '/' + month, {
    dataType: 'json',
    error: function() {
      console.log("ajax error :(");
    },
    success: function(data) {
      var timetableHtml = '<table class="table table-hover"\n>' +
        '<thead>' +
        ' <tr>' +
        '  <th>Date</th>' +
        '  <th>Time</th>' +
        '  <th>Start/End</th>' +
        '  <th>Pause</th>' +
        '  <th>Total</th>' +
        '  <th>Actions</th>' +
        ' </tr>' +
        '</thead>' +
        '<tbody>\n';

      if (data.length > 0) {
        if (data.status && data.status === 'error') {
          strHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem;
          var totalItems = data.length;
          var arrLI = [];
          var tableArray = [];
          var allTimes = {};

          for (intItem = totalItems - 1; intItem >= 0; intItem--) {

// build dict with date 'yyyy-mm-dd' as key and start, start1, start2, ... end, times as value ?!
//          allTimes[data[intItem].time.get]


            // FIXME: use moment here ... get rid of padZero()?!
            var itemDateTime = new Date(data[intItem].time);
            var date = itemDateTime.toDateString();
            var h = padZero(itemDateTime.getHours());
            var m = padZero(itemDateTime.getMinutes());

            var itemDate = moment(data[intItem].time).format("ddd DD");
            var itemTime = moment(data[intItem].time).format("HH:mm");
            var startOrEnd = data[intItem].startOrEnd
            var total = '-';
            var totalNoPause = '-';

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

              total = moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause).format("HH:mm");
              totalNoPause = moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");

              // add durations with/without pause to some global data structure so we can use it to toggle the displayed value
              //

              arrLI.push("END:&nbsp;&nbsp; " + date + " - " + h + ":" + m + " worktime: <span id=\"duration_"+intItem+"\">" + dNoPause + "</span>");
              console.log("item=" + intItem + " start="+starttime.format("HH:mm")+" - end="+endtime.format("HH:mm")+
                          " diff: " + d + " ("+dNoPause+")");

            }

            timetableHtml += '<tr><td>' + itemDate + '</td><td>' + itemTime +
              '</td><td>' + startOrEnd + '</td><td>' + pause.asMinutes() +
              '</td><td>' + total + '</td>';

            timetableHtml += '<td>' +
			  '<div class="btn-group btn-actions">' +
	  		  ' <button type="button" class="btn dropdown-toggle" id="action_' + intItem +
              '" data-toggle="dropdown">Actions <i class="fa fa-angle-down"></i></button>' +
			  ' <ul class="dropdown-menu">' +
			  '  <li><a href="#"><i class="fa fa-edit"></i> Edit</a></li>' +
		      '  <li><a href="#"><i class="fa fa-trash-o"></i> Delete</a></li></ul>' +
              '</div></td>';

            timetableHtml += '</tr>\n';
          }
          strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
        }
      } else {
        strHTMLOutput = "<li>You haven't added any times yet!</li>";
        timetableHtml = "You haven't added any times yet!";
      }
      //$('#myworkhours').html(strHTMLOutput);
      $('#timetable').html(timetableHtml);
    }
  });

}


$(document).ready(function() {
  var strHTMLOutput = '';
  var thisMoment = moment();
  var thisMonth = thisMoment.format('M');
  var thisYear  = thisMoment.format('YYYY');
  whichMonth = thisMonth;
  console.log("this month: " + thisMonth);
  console.log("this year: "  + thisYear);
  $("#month_year").html(thisMonth + "/" + thisYear);

  // view previous or next month
  $("#prevmonth").click(function() {
    thisMoment.add(-1, 'M');
    var prevMonth = thisMoment.format('M');
    var prevYear = thisMoment.format('YYYY');
    console.log("prev  month/year: " + prevMonth + "/" + prevYear);
    $("#month_year").html(prevMonth + "/" + prevYear);
    displayMonthlyStat(prevMonth, prevYear);
  });

  $('#nextmonth').click(function() {
    thisMoment.add(1, 'M');
    var nextMonth = thisMoment.format('M');
    var nextYear = thisMoment.format('YYYY');

    if (nextMonth > thisMonth && nextYear >= thisYear) {
      thisMoment.add(-1, 'M');
      console.log("cannot look into the future!");
    }
    else {
      console.log("next  month/year: " + nextMonth + "/" + nextYear);
      $("#month_year").html(nextMonth + "/" + nextYear);
      displayMonthlyStat(nextMonth, nextYear);
    }
  });

  $('#currentmonth').click(function() {
    thisMoment = moment();
    $("#month_year").html(thisMonth + "/" + thisYear);
    displayMonthlyStat(thisMonth, thisYear);
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

