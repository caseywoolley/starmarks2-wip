import * as ActionTypes from '../constants/ActionTypes';
import * as StarmarkFilters from '../constants/StarmarkFilters';

const initialState = { sortBy: 'dateAdded', reverse: true, filters: {} };

const actionsMap = {
  [ActionTypes.UPDATE_SEARCH](state, { updates }) {
    return { ...state, ...updates };
  },
  [ActionTypes.ADD_FILTER](state, action) {
    return {
      ...state,
      filters: { ...(state.filters || {}), ...action.filter }
    };
  },
  [ActionTypes.UPDATE_FILTER](state, action) {
    // const { filter, index } = action;
    return {
      ...state,
      filters: { ...state.filters, ...action.filter }
      // filters: state.filters
      //   .map((item, i) => (i === action.index ? action.filter : item))
    };
  },
  [ActionTypes.REMOVE_FILTER](state, action) {
    const updatedFilters = { ...state.filters };
    delete updatedFilters[action.index];

    return {
      ...state,
      filters: updatedFilters
    };
  },
  [ActionTypes.RESET_QUERY](state) {
    return { ...state, query: '' };
  },
  [ActionTypes.RESET_SEARCH]() {
    return {
      ...initialState
    };
  },
  [ActionTypes.UPDATE_RESULTS](state, action) {
    const updatedFilters = { ...state.filters };
    delete updatedFilters[action.index];

    return {
      ...state,
      filters: updatedFilters
    };
  },
};

export default function search(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
