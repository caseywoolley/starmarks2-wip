const bookmarkBarId = '1';
const storageBookmarkTitle = 'starmarksData';
const storageUrl = 'http://www.starmarks.com?data=';
// const defaultStorageBookmark = {
//   parentId: bookmarkBarId,
//   title: storageBookmarkTitle,
//   url: `${storageUrl}?data={}`
// };

const buildUrl = state => storageUrl + encodeURIComponent(JSON.stringify(state));

const buildStorageMark = state => ({
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: buildUrl(state)
});

export const updateExistingStorage = (store, state) => {
  // chrome.bookmarks.update(store.id.toString(), { url: `${storageUrl}?data=${JSON.stringify(state)}` });
  chrome.bookmarks.update(store.id.toString(), { url: buildUrl(state) });
};

export const createNewStorage = (state) => {
  // chrome.bookmarks.create(defaultStorageBookmark, updateExistingStorage.bind(state));
  chrome.bookmarks.create(buildStorageMark(state));
};

export const saveState = (state) => {
  chrome.bookmarks.search({ title: storageBookmarkTitle }, (existing) => {
    existing[0] ? updateExistingStorage(existing[0], state) : createNewStorage(state);
  });
};
