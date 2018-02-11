import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import _forEach from 'lodash/forEach';
// import { createNewStorage } from '../../app/utils/bookmarkStorage';

const treeHashToStarmarks = (treeHash) => {
  const starMarks = {};
  let limit = 100;
  _forEach(treeHash, (val, key) => {
    // if (limit > 0) {
      starMarks[key] = { title: val.title, url: key };
      limit -= 1;
    // }
  });
  console.log(starMarks)
  return starMarks;
};

const treeToHash = (nodes, callback) => {
  let nodeHash = {};
  let childHash;
  nodes.forEach((node) => {
    childHash = node.children ? treeToHash(node.children) : {};
    if (node.url) {
      nodeHash[node.url || node.title || 'top'] = node;
    }
    nodeHash = { ...nodeHash, ...childHash };
  });
  if (callback) { callback(treeHashToStarmarks(nodeHash)); }
  return nodeHash;
};

const storageBookmarkTitle = 'starmarksData';
const bookmarkBarId = '1';
const renderApp = (state) => {
  const initialState = state || {};
  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
};
chrome.bookmarks.search({
  title: storageBookmarkTitle
}, (result) => {
  if (result[0] && result[0].url) {
    const dataString = result[0].url.split('?data=')[1];
    debugger
    renderApp(JSON.parse(decodeURIComponent(dataString)));
  } else {
    chrome.bookmarks.getTree((nodes) => {
      treeToHash(nodes, (data) => {
        const newState = { starmarks: data };
        chrome.bookmarks.create({
          parentId: bookmarkBarId,
          title: storageBookmarkTitle,
          url: `http://www.starmarks.com?data=${encodeURIComponent(JSON.stringify(newState))}`
        }, () => {
          renderApp(newState);
        });
      });
    });
  }
});


// chrome.bookmarks.getTree((nodes) => {
//   treeToHash(nodes, (treeHash) => {

//   });
// });
