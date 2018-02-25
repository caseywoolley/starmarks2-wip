import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { initializeState, addVisitListener } from '../../app/utils/bookmarkStorage';

require('../../app/utils/promisifyChrome');

const logResponse = (response) => {
  console.log(response.message);
};

const fallback = (response, store, visitedStarmark) => {
  store.dispatch(TodoActions.addStarmark(visitedStarmark));
};

initializeState((state) => {
  const store = createStore(state);
  addVisitListener(state.starmarks, (visitedStarmark) => {
    chrome.runtime.sendMessageAsync({ message: 'addStarmark', starmark: visitedStarmark })
      .then(logResponse)
      .catch(response => fallback(response, store, visitedStarmark));
  });
});

require('./background/contextMenus');
// require('./background/inject');
require('./background/badge');
