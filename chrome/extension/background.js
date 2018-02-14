import { saveState } from '../../app/utils/bookmarkStorage';
const bluebird = require('bluebird');

global.Promise = bluebird;

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'bookmarks',
  'history',
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);
promisifyAll(chrome.storage, [
  'local',
]);

require('./background/contextMenus');
require('./background/inject');
require('./background/badge');

console.log('background')

chrome.history.onVisited.addListener((history) => {
  console.log(history)
  if (!starmarks[history.url]) return;
  const starmark = starmarks[history.url];
  const { visitCount, lastVisitTime } = history;
  actions.addStarmark({
    ...starmark,
    visitCount,
    lastVisitTime
  });
});
// require('./background/popup');
// chrome.tabs.getCurrent()
//   .then((tab) => {
//     actions.addStarmark({
//       ...starmark,
//       visitCount,
//       lastVisitTime
//     });
//   });

// chrome.history.search({ text: starmark.url }, (history) => {
//   console.log(history)
//   const { visitCount, lastVisitTime } = history[0] || {};
// });
