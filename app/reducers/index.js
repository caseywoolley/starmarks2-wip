import { combineReducers } from 'redux';
import starmarks from './starmarks';
import filters from './filters';
import tags from './tags';

export default combineReducers({
  lastModified: () => Date.now(),
  starmarks,
  filters,
  tags
});
