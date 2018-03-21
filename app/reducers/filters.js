import * as ActionTypes from '../constants/ActionTypes';
import * as StarmarkFilters from '../constants/StarmarkFilters';

const initialState = { sortBy: 'dateAdded' };

const actionsMap = {
  [ActionTypes.ADD_FILTERS](state, action) {
    return {
      ...state,
      ...action.filters
    };
  },
};

export default function filters(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
