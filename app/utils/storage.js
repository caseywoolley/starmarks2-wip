import { saveState } from './bookmarkStorage';
import setBadge from './setBadge';

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
