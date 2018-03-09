import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

const actionsMap = {
  // [ActionTypes.ADD_STARMARK](state, action) {
  //   const { starmark } = action;
  //   const oldStarmark = state[starmark.url] || {};
  //   // starmark.id = starmark.id || _.uniqueId();
  //   return {
  //     ...state,
  //     [starmark.url]: { ...oldStarmark, ...starmark }
  //   };
  // },

};

export default function search(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
