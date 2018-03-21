import { saveState, updateStarmarkBookmark } from './bookmarkStorage';

export default store => next => action => {
  console.group(action.type)
  console.info('dispatching', action);
  const result = next(action)
  const newState = store.getState();
  if (action.starmark) {
    const starmark = newState.starmarks[action.starmark.url];
    console.log('save', starmark);
    updateStarmarkBookmark(starmark);
  }
  // saveState(newState);
  console.groupEnd(action.type);
  return result;
};
