import _ from 'lodash';
import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { getState, saveState } from '../../app/utils/bookmarkStorage';
import bookmarksToStarmarks from '../../app/utils/bookmarksToStarmarks';

require('../../app/utils/promisifyChrome');

const addVisitListener = (starmarks, addStarmark) => {
  chrome.history.onVisited.addListener((history) => {
    if (!starmarks[history.url]) {
      console.log('not a bookmark', history.url, starmarks[history.url]);
      return;
    }
    console.log(`registered visit: ${history.title}`);
    const starmark = starmarks[history.url];
    const { visitCount, lastVisitTime } = history;
    addStarmark({
      ...starmark,
      visitCount,
      lastVisitTime
    });
  });
};

const logResponse = (response) => {
  console.log(response.message);
};

const updateStateOffline = (response, store, starmark) => {
  store.dispatch(TodoActions.addStarmark(starmark));
};

const saveStarmark = (starmark, store) => {
  chrome.runtime.sendMessageAsync({ message: 'addStarmark', starmark })
      .then(logResponse)
      .catch(response => updateStateOffline(response, store, starmark));
};

const backgroundStateRefresh = (store) => {
  const existingState = store.getState();
  // saveState({});
  chrome.bookmarks.getTree((nodes) => {
    bookmarksToStarmarks(nodes)
      .then((bookmarkState) => {
        _.forEach(bookmarkState.starmarks, (starmark) => {
          const existingStarmark = existingState.starmarks[starmark.url];
          const foundStarmark = { ...starmark, id: existingStarmark.id };
          if (!_.isEqual(foundStarmark, existingStarmark)) {
            saveStarmark(foundStarmark, store);
          }
        });
      });
  });
};

getState((state) => {
  const store = createStore(state);
  backgroundStateRefresh(store);
  addVisitListener(state.starmarks, (visitedStarmark) => {
    saveStarmark(visitedStarmark, store);
  });
});

require('./background/contextMenus');
// require('./background/inject');
require('./background/badge');
