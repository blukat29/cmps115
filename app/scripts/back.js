'use strict';

var domainCount = [];
var dateCount = [];
var dayHourCount = [];

// http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function collectData(callback) {

  var _searchDuration = 1000 * 60 * 60 * 24 * 7 * 20;  // 20 weeks.
  var options = {
    text: "",
    startTime: (new Date).getTime() - _searchDuration,
    maxResults: 100000
  };

  chrome.history.search(options, function(results) {

    /* Count hits per domain, per date. */
    var domainCountDict = {};
    var dateCountDict = {};
	var tempDayHourCount = [];
	for (var i = 0; i < 7; i++) {
		tempDayHourCount[i] = [];
		for (var j = 0; j < 24; j++) {
			tempDayHourCount[i][j] = 0;
		}
	}
    for (var i = 0; i < results.length; i ++) {
      var datetime = new Date(results[i].lastVisitTime);
      var date = (new Date(datetime));
      date.setHours(0,0,0,0);
      dateCountDict[date] = (dateCountDict[date] + 1) || 1;

      var domain = extractDomain(results[i].url);
      domainCountDict[domain] = (domainCountDict[domain] + 1) || 1;

	  tempDayHourCount[datetime.getDay()][datetime.getHours()]++;
    }

	for (var i = 0; i < 7; i++) {
		for (var j = 0; j < 24; j++) {
			dayHourCount.push({day:i+1, hour:j+1, value:tempDayHourCount[i][j]});
		}
	}
    /* Convert dictionary into array of objects. */
    domainCount = Object.keys(domainCountDict).map(function(k) {
      return { domain: k, count: domainCountDict[k] };
    });
    dateCount = Object.keys(dateCountDict).map(function(k) {
      return { date: k, count: dateCountDict[k] };
    });
    /* Sort arrays. */
    domainCount.sort(function(a, b) {
      return b.count - a.count;
    });
    dateCount.sort(function(a, b) {
      return (new Date(a.date)) - (new Date(b.date));
    });

    if (callback)
      callback();
  });
}

