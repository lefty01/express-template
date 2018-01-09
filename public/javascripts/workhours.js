//var moment = require('moment');
//var whichMonth;
//var durations = {};
var allVldTotals = {}; // contains valid totals (that is we have start & end) with and without pause


function isDef(what) {
    if (what && what !== "null" && what !== "undefined") {
	return true;
    }
    return false;
}

//   if (db && db !== "null" && db !== "undefined") {
function displayMonthlyStat(month, year) {
    var pause = moment.duration({ minutes: 50 });
    var monthly_total = moment.duration({hour:  0, minute:  0});
//    var timesPerDay = new Map();

  $.ajax('/workhours/' + year + '/' + month, {
    dataType: 'json',
    error: function() {
      console.log("ajax error :(");
    },
    success: function(data) {
      var timetableHtml = '<table class="table table-bordered table-condensed table-hover" id="worktime-table"\n>' +
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

          for (intItem = totalItems - 1; intItem >= 0; intItem--) {
            var itemDate = moment(data[intItem].time).format("ddd DD");
            var itemTime = moment(data[intItem].time).format("HH:mm");
            var startOrEnd = data[intItem].startOrEnd;
            var total = '-';
            //var total_moment_d = moment.duration({hour:  0, minute:  0});
            var totalNoPause = '-';

            if ("START" === data[intItem].startOrEnd) {
		var starttime = moment(data[intItem].time);

		// if (isDef(timesPerDay.get(itemDate)) && isDef(timesPerDay[itemDate].START)) {
		//     console.log("START exist for day: " + itemDate);
		// } else {
		//     console.log("add START for day: " + itemDate);
		//     timesPerDay[itemDate] = {
		// 	START: starttime
		//     };
		// }

            } else {
              var endtime = moment(data[intItem].time);
		// if (isDef(timesPerDay[itemDate])  && isDef(timesPerDay[itemDate].END)) {
		//     console.log("END exists for day: " + itemDate);
		// } else {
		//     console.log("add END for day: " + itemDate);
		//     timesPerDay[itemDate] = {
		// 	END: endtime
		//     };
		// }
              
              //var dNoPause = moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");
              total = moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause).format("HH:mm");
              total_moment_d = moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause);
              totalNoPause = moment.utc(moment(endtime).diff(moment(starttime))).format("HH:mm");

              // add total times with/without pause to some global data structure so we can use it to toggle the displayed value
              if (isDef(total) && isDef(totalNoPause)) {
                allVldTotals[intItem] = {
                  total: total,
                  totalNoPause: totalNoPause
                };
		  //var total_moment_d = moment.duration({hour:  0, minute:  0});
		  //monthly_total.add(moment.utc(moment(endtime).diff(moment(starttime))).subtract(pause).duration);
              }

              //monthly_total.add(total_moment_d.duration);
              console.log("monthly total: " + moment(monthly_total).format("HH::mm"));

              console.log("item=" + intItem + " start=" + (isDef(starttime) ? starttime.format("HH:mm") : "n/a")
                          + " - end=" + (isDef(endtime) ? endtime.format("HH:mm") : "n/a") +
                          " diff: " + total + " (" + totalNoPause + ").");
            }

            timetableHtml += '<tr><td>' + itemDate + '</td><td>' + itemTime +
              '</td><td>' + startOrEnd + '</td><td>' + pause.asMinutes() +
              '</td><td id="total_' + intItem + '">' + total + '</td>';

            timetableHtml += '<td>' +
              '<div class="btn-group btn-actions">' +
              ' <button type="button" class="btn dropdown-toggle"' +
              ' data-toggle="dropdown">Actions <i class="fa fa-angle-down"></i></button>' +
              ' <ul class="dropdown-menu">' +
              '  <li><a href="#"><i class="fa fa-edit"    id="' + data[intItem]._id + '"></i> Edit</a></li>' +
             // '  <li><a href="#"><i class="fa fa-plus"    id="' + intItem + '"></i> Insert</a></li>' +
              '  <li><a href="#"><i class="fa fa-trash-o" id="' + data[intItem]._id + '"></i> Delete</a></li></ul>' +
              '</div></td>';

            timetableHtml += '</tr>\n';
          }
        }
      } else {
        //strHTMLOutput = "<li>You haven't added any times yet!</li>";
        timetableHtml = "You haven't added any times yet!";
      }
      //$('#myworkhours').html(strHTMLOutput);
      $('#timetable').html(timetableHtml);
    }
  });

}

function removeEntry(id) {
  var confirmation = confirm('Are you sure you want to delete this entry?');
  if (confirmation === true) {
    $.ajax('/workhours/' + id, {
      type: 'DELETE',
      error: function(data) {
        console.log("ajax error :( " + data);
      },
      success: function(data) {
        console.log("OK :) " + data);
      }
    });
  } else {
    return false;
  }
  return true;
}

function editEntry(id) {
    alert("going to edit id: " + id);
    
  //   $.ajax('/workhours/' + id, {
  //     type: 'DELETE',
  //     error: function(data) {
  //       console.log("ajax error :( " + data);
  //     },
  //     success: function(data) {
  //       console.log("OK :) " + data);
  //     }
  //   });
  //   return false;
    return true;
}

function insertEntry(month) {
    alert("going to insert new entry for month: " + month);
}



$(document).ready(function() {
  // enable bootstrap tooltips (here used for prev/next month display)
  $('[data-toggle="tooltip"]').tooltip();
  $('#worktime-table').DataTable();

  var strHTMLOutput = '';
  var thisMoment = moment();
  var thisMonthYear = thisMoment.format('M/YYYY');
  var thisMonth = thisMoment.format('M');
  var thisYear  = thisMoment.format('YYYY');

  // get prev month for tooltip
  var prevMonthYearTT = moment().add(-1, 'M').format('M/YY');
  var nextMonthYearTT = moment().format('M/YY');

  //whichMonth = thisMonth;
  console.log("this month: " + thisMonth);
  console.log("this year: "  + thisYear);
  $("#month_year").html(thisMonthYear);
  $("a#prevmonth").attr("title", prevMonthYearTT);
  $("a#nextmonth").attr("title", nextMonthYearTT);

  // view previous or next month
  $("#prevmonth").click(function() {
    nextMonthYearTT = thisMoment.format('M/YY');
    thisMoment.add(-1, 'M');
    var prevMonthYear = thisMoment.format('M/YYYY');
    prevMonthYearTT = moment(thisMoment).add(-1, 'M').format('M/YY');

    console.log("prev  month/year: " + prevMonthYear);
    $("#month_year").html(prevMonthYear);
    $("a#prevmonth").attr("title", prevMonthYearTT);
    $("a#nextmonth").attr("title", nextMonthYearTT);

    displayMonthlyStat(thisMoment.format('M'), thisMoment.format('YYYY'));
  });

  $('#nextmonth').click(function() {
    thisMoment.add(1, 'M');
    var nextMonth = thisMoment.format('M');
    var nextYear = thisMoment.format('YYYY');
    var nextMonthYear = thisMoment.format('M/YY');

    if (nextMonth > thisMonth && nextYear >= thisYear) {
      thisMoment.add(-1, 'M');
      console.log("cannot look into the future!");
    }
    else {
      prevMonthYearTT = moment(thisMoment).add(-1, 'M').format('M/YY');
      nextMonthYearTT = moment(thisMoment).add( 1, 'M').format('M/YY');
      console.log("next  month/year: " + nextMonth + "/" + nextYear);
      $("#month_year").html(nextMonth + "/" + nextYear);
      $("a#prevmonth").attr("title", prevMonthYearTT);
      $("a#nextmonth").attr("title", nextMonthYearTT);
      displayMonthlyStat(nextMonth, nextYear);
    }
  });

  $('#currentmonth').click(function() {
    thisMoment = moment();
    nextMonthYearTT = thisMoment.add( 0, 'M').format('M/YY');
    prevMonthYearTT = thisMoment.add(-1, 'M').format('M/YY');
    $("a#prevmonth").attr("title", prevMonthYearTT);
    $("a#nextmonth").attr("title", nextMonthYearTT);
    $("#month_year").html(thisMonth + "/" + thisYear);
    displayMonthlyStat(thisMonth, thisYear);
  });

  var ckbox = $('#add_pause');
  $('input#add_pause').on('click',function () {
    if ($('#add_pause').is(':checked')) {
      console.log("Show total with Pause time substracted");
      for (var key in allVldTotals) {
        console.log(key, allVldTotals[key].total);
        $("#total_" + key).text(allVldTotals[key].total);
      }
    } else {
      console.log("Show total without Pause!");
      for (var key in allVldTotals) {
        console.log(key, allVldTotals[key].totalNoPause);
        $("#total_" + key).text(allVldTotals[key].totalNoPause);
      }
    }
  });


  $(document).on('click', '.dropdown-menu li a', function() {
    var matches = $(this).html().match(/<i class="fa fa-.*" id="([a-f0-9]+)"><\/i> (Delete|Edit|Insert)/);

    if ("Delete" === matches[2]) {
      //alert("going to delete id: " + matches[1]);
      removeEntry(matches[1]);
    }
    else if ("Edit" === matches[2]) {
	editEntry(matches[1]);
    }
    else if ("Insert" === matches[2]) {
	insertEntry(thisMonth);
    }
    displayMonthlyStat(thisMonth, thisYear);
  });


  displayMonthlyStat(thisMonth, thisYear);
});
