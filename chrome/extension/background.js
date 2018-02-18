import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { initializeState, addVisitListener } from '../../app/utils/bookmarkStorage';

require('../../app/utils/promisifyChrome');

let store;
initializeState((state) => {
  store = createStore(state);
  addVisitListener(state.starmarks, (newStarmark) => {
    chrome.runtime.sendMessage({ message: 'addStarmark', starmark: newStarmark }, (response) => {
      if (!response) { store.dispatch(TodoActions.addStarmark(newStarmark)); }
    });
  });
});

// module.exports = () => store;

require('./background/contextMenus');
// require('./background/inject');
require('./background/badge');
