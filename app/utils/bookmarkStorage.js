import _ from 'lodash';
const bookmarkBarId = '1';
const storageBookmarkTitle = 'starmarksData';
const storageUrl = 'http://www.starmarks.com?data=';
const initialState = { starmarks: {} };

const buildUrl = state => storageUrl + encodeURIComponent(JSON.stringify(state));
const buildStorageMark = state => ({
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: buildUrl(state)
});

const treeHashToStarmarks = (treeHash, callback) => {
  const starmarks = {};
  _.forEach(treeHash, (val, url) => {
    const { title, dateAdded } = val;
    starmarks[url] = { title, url, dateAdded, lastVisitTime: 0, visitCount: 0 };
  });
  chrome.history.search({ text: '', startTime: 0, maxResults: 0 }, (history) => {
    if (history[0]) {
      const histKeys = _.keyBy(history, 'url')
      _.forEach(starmarks, (starmark, url) => {
        if (histKeys[url]) {
          console.log(histKeys[url])
          const { visitCount, lastVisitTime } = histKeys[url];
          starmarks[url] = { ...starmark, visitCount, lastVisitTime };
        }
      });
    }
    if (callback) { callback(starmarks); }
  });
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
  if (callback) { treeHashToStarmarks(nodeHash, callback); }
  return nodeHash;
};

export const getExistingState = (callback) => {
  chrome.bookmarks.search({ title: storageBookmarkTitle }, (existing) => {
    callback(existing);
  });
};

export const updateExistingStorage = (store, state) => {
  chrome.bookmarks.update(store.id.toString(), { url: buildUrl(state) });
};

export const createNewStorage = (state, callback) => {
  chrome.bookmarks.create(buildStorageMark(state), callback);
};

export const saveState = (state) => {
  getExistingState((existing) => {
    existing[0] ? updateExistingStorage(existing[0], state) : createNewStorage(state);
  });
};

export const getState = (callback) => {
  getExistingState((existing) => {
    callback(existing[0] || initialState);
  });
};

export const initializeState = (callback) => {
  getExistingState((data) => {
    if (data[0] && data[0].url) {
      const stateJson = data[0].url.split('?data=')[1];
      const existingState = JSON.parse(decodeURIComponent(stateJson));
      callback(existingState);
    } else {
      chrome.bookmarks.getTree((nodes) => {
        treeToHash(nodes, (hash) => {
          const newState = { starmarks: hash };
          createNewStorage(newState, () => { callback(newState); });
        });
      });
    }
  });
};

export const addVisitListener = (starmarks, addStarmark) => {
  chrome.history.onVisited.addListener((history) => {
    if (!starmarks[history.url]) {
      console.log('not a bookmark', history.url, starmarks[history.url]);
      return;
    }
    console.log(`registered visit: ${history.title}`);
    const starmark = starmarks[history.url];
    const { visitCount, lastVisitTime } = history;
    addStarmark({
      ...starmark,
      visitCount,
      lastVisitTime
    });
  });
};
