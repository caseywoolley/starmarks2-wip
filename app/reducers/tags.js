import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

const actionsMap = {
  [ActionTypes.ADD_TAG](state, action) {
    const { tag } = action;
    const oldTag = state[tag.id] || {};
    return {
      ...state,
      [tag.id]: { ...oldTag, ...tag }
    };
  },
  [ActionTypes.ADD_TAGS](state, action) {
    return { ...action.tags };
  },
};

export default function tags(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
