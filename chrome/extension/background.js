import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { getState, stateRefresh, updateStarmarkBookmark } from '../../app/utils/bookmarkStorage';

require('../../app/utils/promisifyChrome');

const addVisitListener = async (callback) => {
  chrome.history.onVisited.addListener((history) => {
    getState((state) => {
      const starmarks = state.starmarks;
      const starmark = starmarks[history.url];
      if (!starmark) {
        console.log('not a bookmark', history.url);
        return;
      }
      console.log(`registered visit: ${history.title}`);
      const { visitCount, lastVisitTime } = history;
      callback({ ...starmark, visitCount, lastVisitTime });
    });
  });
};

const logResponse = (response) => {
  console.log(response.message);
};

const updateStateOffline = (response, store, starmark) => {
  store.dispatch(TodoActions.addStarmark(starmark));
  // updateStarmarkBookmark(starmark);
};

const saveStarmark = (starmark, store) => {
  // updateStateOffline(null, store, starmark);
  // chrome.runtime.sendMessageAsync({ message: 'refreshState' });
  chrome.runtime.sendMessageAsync({ message: 'addStarmark', starmark })
      .then(logResponse)
      .catch(response => updateStateOffline(response, store, starmark));
};

const initialize = () => {
  getState((state) => {
    const store = createStore(state);
    stateRefresh(store);
    addVisitListener((visitedStarmark) => {
      saveStarmark(visitedStarmark, store);
    });
  });
};

// export const backgroundStateRefresh = () => {
//   getState((state) => {
//     const store = createStore(state);
//     stateRefresh(store);
//   });
// };

initialize();

require('./background/contextMenus');
// require('./background/inject');
require('./background/badge');
