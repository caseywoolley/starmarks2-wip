import { updateStarmark } from './bookmarksToStarmarks';

export default store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  const result = next(action)
  const newState = store.getState();
  console.log('next state', newState)
  const starmark = newState.starmarks[action.starmark.url];
  console.log('save', starmark)
  updateStarmark(starmark)

  console.groupEnd(action.type)
  return result
}
