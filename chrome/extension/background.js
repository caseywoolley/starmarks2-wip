import _ from 'lodash';
import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { getState, decodeState, saveState } from '../../app/utils/bookmarkStorage';
import { treeRecurse, nodeToStarmark, nodeToTag, getHistory, getNodeHistory } from '../../app/utils/bookmarksToStarmarks';

require('../../app/utils/promisifyChrome');

const urlBase = 'http://www.starmarks.com/?starmark=';

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

const treeToState = (store, historyArray) => {
  const existingState = store.getState();
  const history = _.keyBy(historyArray, 'url');
  let localStarmark;
  let persistentStarmark;
  return (node, parents) => {
    if (node.url) {
      //compare local storage with bookmark storage
      if (_.startsWith(node.url, urlBase)) {
        const stateJson = node.url.split('?starmark=')[1];
        persistentStarmark = { ...decodeState(stateJson), ...getNodeHistory(node.title, history) };
        if (!persistentStarmark.rating || persistentStarmark.rating === 0) {
          persistentStarmark.rating = 1;
        }
        const { url } = persistentStarmark;
        localStarmark = { ...existingState.starmarks[url] };
        localStarmark.id = persistentStarmark.id = node.id;
        return persistentStarmark;
      }
      persistentStarmark = { ...nodeToStarmark(node, parents), ...getNodeHistory(node.url, history) };
      return persistentStarmark;
    } else if (node.title) {
      const tag = nodeToTag(node);
      return tag;
    }
  };
};

const backgroundStateRefresh = (store) => {
  chrome.bookmarks.getTree((nodes) => {
    getHistory().then((history) => {
      const state = treeRecurse(nodes, treeToState(store, history));
      console.log(state)
      store.dispatch(TodoActions.addStarmarks(state.starmarks));
      store.dispatch(TodoActions.addTags(state.tags));
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
