import bookmarksToStarmarks from './bookmarksToStarmarks';

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

const encodeState = state => encodeURIComponent(JSON.stringify(state));
const decodeState = state => JSON.parse(decodeURIComponent(state || '{}'));

export const saveState = (state) => {
  chrome.storage.local.set({ state: encodeState(state) });
  // getExistingState((existing) => {
  //   existing[0] ? updateExistingStorage(existing[0], state) : createNewStorage(state);
  // });
};

export const getState = (callback) => {
  chrome.storage.local.get('state', data => callback(decodeState(data.state)));
  // getExistingState((existing) => {
  //   callback(existing[0] || initialState);
  // });
};

export const updateExistingStorage = (store, state) => {
  saveState(state);
  // chrome.bookmarks.update(store.id.toString(), { url: buildUrl(state) });
};

export const getExistingState = (callback) => {
  getState(callback);
  // chrome.runtime.sendMessage({ message: 'getState'}, (existing) => {
  //   callback(existing)
  // });
  // chrome.bookmarks.search({ title: storageBookmarkTitle }, (existing) => {
  //   callback(existing);
  // });
};

export const createNewStorage = (state, callback) => {
  // chrome.bookmarks.create(buildStorageMark(state), callback);
};

// export const getBookmarkState = (callback) => {
//   chrome.bookmarks.getTree((nodes) => {
//     bookmarksToStarmarks(nodes)
//       .then((state) => {
//         callback(state);
//       });
//   });
// };

export const initializeState = (callback) => {
  getState((state) => {
    if (state.starmarks) {
      callback(state);
    } else {
  // getExistingState((data) => {
    // if (data[0] && data[0].url) {
    //   const stateJson = data[0].url.split('?data=')[1];
    //   const existingState = JSON.parse(decodeURIComponent(stateJson));
    //   callback(existingState);
    // } else {
      chrome.bookmarks.getTree((nodes) => {
        bookmarksToStarmarks(nodes)
          .then((state) => {
            chrome.storage.local.set({ state: encodeURIComponent(JSON.stringify(state)) }, () => {
              callback(state);
            });
            // createNewStorage(state, () => { callback(state); });
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
