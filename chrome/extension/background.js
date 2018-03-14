import _ from 'lodash';
import * as TodoActions from '../../app/actions/todos';
import createStore from '../../app/store/configureStore';
import { getState, decodeState, saveState } from '../../app/utils/bookmarkStorage';
import { treeRecurse, nodeToStarmark, getHistory, getNodeHistory } from '../../app/utils/bookmarksToStarmarks';

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

// const processTree = (store) => {
//   _.forEach(bookmarkState.starmarks, (starmark) => {
//     const localStarmark = existingState.starmarks[starmark.url];
//     const foundStarmark = { ...starmark, id: localStarmark.id };
//     if (!_.isEqual(foundStarmark, localStarmark)) {
//       saveStarmark(foundStarmark, store);
//     }
//   });
// };

// const queueManager = () => {
//   const queues = {};
//   const add = (item) =>
//   return {

//   }
// }

const treeToState = (store, historyArray) => {
  const existingState = store.getState();
  const history = _.keyBy(historyArray, 'url');
  const queue = [];
  let localStarmark;
  let persistentStarmark;
  return (node) => {
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
        // persistentStarmark.id = localStarmark.id;
        if (!_.isEqual(persistentStarmark, localStarmark)) { //or if localStarmark.bookmarkIds does not contain node.id
          saveStarmark(persistentStarmark, store);
        }
      // see if new bookmark with no associated starmark
      } else if (!existingState.starmarks[node.url]) {
        persistentStarmark = { ...nodeToStarmark(node), ...getNodeHistory(node.url, history) };
        saveStarmark(persistentStarmark, store);
      // compare bookmark with existing starmark ?
      } else if (existingState.starmarks[node.url]) {
        // persistentStarmark = { ...nodeToStarmark(node), ...getNodeHistory(node, history) };
        // localStarmark = existingState.starmarks[node.url];
        // const { id, bookmarkIds, parentId, tags } = localStarmark;
        // persistentStarmark.dateAdded = localStarmark.dateAdded = Math.min(persistentStarmark.dateAdded, localStarmark.dateAdded);
        // persistentStarmark = { ...nodeToStarmark(node), ...getNodeHistory(node, history), id, bookmarkIds, parentId, tags };
      }


    // } else if (node.title) {
    //   const existingTag = existingState.tags[node.id];
    //   const foundStarmark = { ...nodeToStarmark(node), id: existingTag.id };
    //   if (!_.isEqual(foundStarmark, existingTag)) {
    //     saveStarmark(foundStarmark, store);
    //   }
    // }
    }
  };
};

const backgroundStateRefresh = (store) => {
  // const existingState = store.getState();
  // saveState({});
  chrome.bookmarks.getTree((nodes) => {
    getHistory().then((history) => {
      treeRecurse(nodes, treeToState(store, history));
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
