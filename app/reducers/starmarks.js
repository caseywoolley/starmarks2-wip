import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

const actionsMap = {
  [ActionTypes.ADD_STARMARK](state, action) {
    const { starmark } = action;
    const oldStarmark = state[starmark.url] || {};
    return {
      ...state,
      [starmark.url]: { ...oldStarmark, ...starmark }
    };
  },
  [ActionTypes.ADD_STARMARKS](state, action) {
    return { ...action.starmarks };
  },
  [ActionTypes.REFRESH_STATE](state) {
    return { ...state };
  }
  // [ActionTypes.EDIT_STARMARK](state, action) {
  //   return state.map(todo =>
  //     (todo.id === action.id ?
  //       Object.assign({}, todo, { text: action.text }) :
  //       todo)
  //   );
  // },
  // [ActionTypes.DELETE_STARMARK](state, action) {
  //   return state.filter(todo =>
  //     todo.id !== action.id
  //   );
  // },
  // [ActionTypes.ADD_TODO](state, action) {
  //   return [{
  //     id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
  //     completed: false,
  //     text: action.text
  //   }, ...state];
  // },
  // [ActionTypes.DELETE_TODO](state, action) {
  //   return state.filter(todo =>
  //     todo.id !== action.id
  //   );
  // },
  // [ActionTypes.EDIT_TODO](state, action) {
  //   return state.map(todo =>
  //     (todo.id === action.id ?
  //       Object.assign({}, todo, { text: action.text }) :
  //       todo)
  //   );
  // },
  // [ActionTypes.COMPLETE_TODO](state, action) {
  //   return state.map(todo =>
  //     (todo.id === action.id ?
  //       Object.assign({}, todo, { completed: !todo.completed }) :
  //       todo)
  //   );
  // },
  // [ActionTypes.COMPLETE_ALL](state/*, action*/) {
  //   const areAllCompleted = state.every(todo => todo.completed);
  //   return state.map(todo => Object.assign({}, todo, {
  //     completed: !areAllCompleted
  //   }));
  // },
  // [ActionTypes.CLEAR_COMPLETED](state/*, action*/) {
  //   return state.filter(todo => todo.completed === false);
  // }
};

export default function starmarks(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
