import _forEach from 'lodash/forEach';
const bookmarkBarId = '1';
const storageBookmarkTitle = 'starmarksData';
const storageUrl = 'http://www.starmarks.com?data=';

const buildUrl = state => storageUrl + encodeURIComponent(JSON.stringify(state));
const buildStorageMark = state => ({
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: buildUrl(state)
});

const treeHashToStarmarks = (treeHash) => {
  const starMarks = {};
  _forEach(treeHash, (val, key) => {
    starMarks[key] = { title: val.title, url: key };
  });
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

export const hasExistingState = (callback) => {
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
  hasExistingState((existing) => {
    existing[0] ? updateExistingStorage(existing[0], state) : createNewStorage(state);
  });
};

export const initializeState = (callback) => {
  hasExistingState((data) => {
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
