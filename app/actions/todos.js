import * as types from '../constants/ActionTypes';

export function addStarmark(starmark) {
  return { type: types.ADD_STARMARK, starmark };
}

export function addStarmarks(starmarks) {
  return { type: types.ADD_STARMARKS, starmarks };
}

export function addTag(tag) {
  return { type: types.ADD_TAG, tag };
}

export function addTags(tags) {
  return { type: types.ADD_TAGS, tags };
}

export function updateSearch(updates) {
  return { type: types.UPDATE_SEARCH, updates };
}

export function addFilter(filter) {
  return { type: types.ADD_FILTER, filter };
}

export function updateFilter(filter, index) {
  return { type: types.UPDATE_FILTER, filter, index };
}

export function removeFilter(index) {
  return { type: types.REMOVE_FILTER, index };
}

export function resetQuery() {
  return { type: types.RESET_QUERY };
}

export function resetSearch() {
  return { type: types.RESET_SEARCH };
}

export function refreshState() {
  return { type: types.REFRESH_STATE };
}

export function setSelection(selection) {
  return { type: types.SET_SELECTION, selection };
}

// export function addTodo(text) {
//   return { type: types.ADD_TODO, text };
// }

// export function deleteTodo(id) {
//   return { type: types.DELETE_TODO, id };
// }

// export function editTodo(id, text) {
//   return { type: types.EDIT_TODO, id, text };
// }

// export function completeTodo(id) {
//   return { type: types.COMPLETE_TODO, id };
// }

// export function completeAll() {
//   return { type: types.COMPLETE_ALL };
// }

// export function clearCompleted() {
//   return { type: types.CLEAR_COMPLETED };
// }
