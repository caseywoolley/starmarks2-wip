import { combineReducers } from 'redux';
import starmarks from './starmarks';
import search from './search';
import tags from './tags';

export default combineReducers({
  lastModified: () => Date.now(),
  starmarks,
  search,
  tags
});
