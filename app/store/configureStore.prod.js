import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import storage from '../utils/storage';
import storeOnAction from '../utils/storeOnAction';

const middlewares = applyMiddleware(thunk, storeOnAction);
const enhancer = compose(
  middlewares,
  storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
