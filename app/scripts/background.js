'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '0'});

console.log('Event Page for Browser Action');

//var testOptions = {
//  color: 'black'
//};
