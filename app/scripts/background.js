'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

console.log('COLORFUL HISTROY ROCKS!');

chrome.browserAction.onClicked.addListener(function(tab) {
  window.open(chrome.extension.getURL('analysis.html'), '_blank');
});

