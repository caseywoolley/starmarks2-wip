import bookmarksToStarmarks from './bookmarksToStarmarks';

const bookmarkBarId = '1';
const storageBookmarkTitle = 'starmarksData';
const storageUrl = 'http://www.starmarks.com?data=';
const initialState = { starmarks: {}, tags: {} };

const buildUrl = state => storageUrl + encodeURIComponent(JSON.stringify(state));
const buildStorageMark = state => ({
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: buildUrl(state)
});

const encodeState = state => encodeURIComponent(JSON.stringify(state));
const decodeState = state => JSON.parse(decodeURIComponent(state || '{}'));

export const saveState = (state) => {
  chrome.storage.local.set({ state: encodeState(state) });
};

export const getState = (callback) => {
  chrome.storage.local.get('state', data => callback(decodeState(data.state)));
};

export const initializeState = (callback) => {
  getState((state) => {
    callback(state);
    // chrome.runtime.sendMessage('refreshState')
    // if (false) {
      // chrome.bookmarks.getTree((nodes) => {
      //   bookmarksToStarmarks(nodes)
      //     .then((bookmarkState) => {
      //       //TODO: capture any changes that occur between initial state and replacement by bookmark state
      //       // saveState(bookmarkState);
      //       // chrome.storage.local.set({ state: encodeURIComponent(JSON.stringify(bookmarkState)) }, () => {
      //       //   callback(bookmarkState);
      //       // });
      //     });
      // });
    // }
  });
};
