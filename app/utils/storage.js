// function saveState(state) {
//   chrome.storage.local.set({ state: JSON.stringify(state) });
// }
import { saveState } from './bookmarkStorage';

// todos unmarked count
function setBadge(starmarks) {
  if (chrome.browserAction) {
    // const count = todos.filter(todo => !todo.marked).length;
    // const count = starmarks
    // chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.starmarks);
    });
    return store;
  };
}
