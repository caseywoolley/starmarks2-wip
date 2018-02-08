// function saveState(state) {
//   chrome.storage.local.set({ state: JSON.stringify(state) });
// }

const storageBookmarkTitle = 'starmarksData';
const bookmarkBarId = '1';
const defaultStorageBookmark = {
  parentId: bookmarkBarId,
  title: storageBookmarkTitle,
  url: 'http://www.starmarks.com?data={}'
};

function saveState(state) {
  chrome.bookmarks.search({ title: storageBookmarkTitle }, (result) => {
    result[0] ? updateExistingStorage(result[0], state) : createNewStorage(state);
  });
}

function updateExistingStorage(store, state) {
  chrome.bookmarks.update(store.id.toString(), { url: `http://starmarks.com?data=${JSON.stringify(state)}` });
}

function createNewStorage(state) {
  chrome.bookmarks.create(defaultStorageBookmark, updateExistingStorage.bind(state));
}

// todos unmarked count
function setBadge(todos) {
  if (chrome.browserAction) {
    // const count = todos.filter(todo => !todo.marked).length;
    // chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.todos);
    });
    return store;
  };
}
