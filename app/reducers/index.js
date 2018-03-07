import { combineReducers } from 'redux';
import starmarks from './starmarks';
import tags from './tags';

export default combineReducers({
  starmarks,
  tags
});
