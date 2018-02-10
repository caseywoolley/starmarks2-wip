const storageBookmarkTitle = 'starmarksData';
const bookmarkBarId = '1';
const defaultStorageBookmark = {
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: 'http://www.starmarks.com?data={}'
};
// encodeURIComponent(url)
export const updateExistingStorage = (store, state) => {
  chrome.bookmarks.update(store.id.toString(), { url: `http://starmarks.com?data=${JSON.stringify(state)}` });
};

export const createNewStorage = (state) => {
  chrome.bookmarks.create(defaultStorageBookmark, updateExistingStorage.bind(state));
};

export const saveState = (state) => {
  chrome.bookmarks.search({ title: storageBookmarkTitle }, (result) => {
    result[0] ? updateExistingStorage(result[0], state) : createNewStorage(state);
  });
};
