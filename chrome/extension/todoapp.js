import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#901144
const getParameterByName = (name, url) => {
  const match = RegExp(`${name}=([^&]*)`).exec(url.split('?')[1]);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};
const storageBookmarkTitle = 'starmarksData';
const bookmarkBarId = '1';
const renderApp = (state) => {
  const initialState = JSON.parse(state || '{}');
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
    renderApp(getParameterByName('data', result[0].url));
  }

  if (!result[0]) {
    chrome.bookmarks.create({
      parentId: bookmarkBarId,
      title: 'starmarksData',
      url: 'http://www.starmarks.com?data={}'
    }, (newBookmark) => {
      renderApp(getParameterByName('data', newBookmark.url));
    });
  }
});
