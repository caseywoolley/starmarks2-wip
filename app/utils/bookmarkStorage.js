const storageBookmarkTitle = 'starmarksData';
const bookmarkBarId = '1';
const storageUrl = 'http://www.starmarks.com';
const defaultStorageBookmark = {
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: `${storageUrl}?data={}`
};

export const updateExistingStorage = (store, state) => {
  chrome.bookmarks.update(store.id.toString(), { url: `${storageUrl}?data=${JSON.stringify(state)}` });
};

export const createNewStorage = (state) => {
  chrome.bookmarks.create(defaultStorageBookmark, updateExistingStorage.bind(state));
};

export const saveState = (state) => {
  chrome.bookmarks.search({ title: storageBookmarkTitle }, (existing) => {
    existing[0] ? updateExistingStorage(existing[0], state) : createNewStorage(state);
  });
};
