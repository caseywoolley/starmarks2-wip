import * as ActionTypes from '../constants/ActionTypes';
import * as StarmarkFilters from '../constants/StarmarkFilters';

const searchFilters = {
  stars: { name: 'Rating', placeholder: 'ex 5, 2-4, 3+' },
  visits: { name: 'Visits', placeholder: 'ex 1-5, 20+, 2' },
  dateAdded: { name: 'Date Added', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  lastVisit: { name: 'Last Visited', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  tags: { name: 'Tags', suggestedValues: [], placeholder: 'ex tag1, tag2 ...' },
  title: { name: 'Title', placeholder: 'Title...' },
  url: { name: 'Url', placeholder: 'Url...' }
};
const initialState = { sortBy: 'dateAdded', reverse: true };

const actionsMap = {
  [ActionTypes.UPDATE_SEARCH](state, { updates }) {
    return { ...state, ...updates };
  },
  [ActionTypes.ADD_FILTER](state, action) {
    return {
      ...state, filters: [...(state.filters || []), { name: action.filter }]
    };
  },
  [ActionTypes.UPDATE_FILTER](state, action) {
    // const { filter, index } = action;
    return {
      ...state,
      filters: state.filters
        .map((item, i) => (i === action.index ? action.filter : item))
    };
    // return {
    //   filters: [
    //     ...state.filters.slice(0, index),
    //     filter,
    //     ...state.filters.slice(index + 1)
    //   ]
    // };
  },
  [ActionTypes.REMOVE_FILTER](state, action) {
    return {
      ...state,
      filters: state.filters
        .filter((item, i) => i !== action.index)
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
};

export default function search(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
