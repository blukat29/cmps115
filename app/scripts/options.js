'use strict';

var domainCount = {};

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

chrome.history.search({text:""}, function(results) {
  for (var i=0; i<results.length; i++) {
    var domain = extractDomain(results[i].url);
    if (domain in domainCount) {
      domainCount[domain] ++;
    } else {
      domainCount[domain] = 1;
    }
  }
  console.log(domainCount);
});
