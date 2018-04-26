import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';

const initialState = { selection: [] };

const actionsMap = {
  [ActionTypes.SET_SELECTION](state, action) {
    const { selection } = action;
    return {
      ...state,
      selection
    };
  }
};

export default function ui(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
