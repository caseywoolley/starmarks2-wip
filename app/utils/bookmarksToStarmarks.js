import _ from 'lodash';
import Promise from 'bluebird';
import * as TodoActions from '../../app/actions/todos';


const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });
require('../../app/utils/promisifyChrome');

const storageFolderTitle = 'Starmarks Data';
const urlBase = 'http://www.starmarks.com/?starmark=';
const buildStarmarkUrl = state => `${urlBase}${encodeURIComponent(JSON.stringify(state))}`;
const buildStorageFolder = () => ({
  parentId: '1',
  title: storageFolderTitle
});

export const encodeState = state => encodeURIComponent(JSON.stringify(state));
export const decodeState = state => JSON.parse(decodeURIComponent(state || '{}'));

export const saveState = (state) => {
  chrome.storage.local.set({ state: encodeState(state) });
};

export const getState = (callback) => {
  chrome.storage.local.get('state', data => callback(decodeState(data.state)));
};

export const getHistory = () => chrome.history.searchAsync({ text: '', startTime: 0, maxResults: 0 });
const createStarmarkFolder = () => chrome.bookmarks.createAsync(buildStorageFolder());
const getStarmarkFolder = () => chrome.bookmarks.searchAsync({ title: storageFolderTitle })
  .then(([starmarkFolder]) => starmarkFolder || createStarmarkFolder());
const getStarmarkBookmark = url => chrome.bookmarks.searchAsync({ title: url });
const handleSaveError = err => console.log(err);

const updateStarmarkBookmark = (id, starmark) => chrome.bookmarks
  .updateAsync(id, { url: buildStarmarkUrl(starmark) })
  .then(bookmark => console.log('updated bookmark', bookmark))
  .catch(handleSaveError);

const createStarmarkBookmark = (id, starmark) => chrome.bookmarks
  .createAsync({ parentId: id, title: starmark.url, url: buildStarmarkUrl(starmark) })
  .then(newBookmark => console.log('created bookmark', newBookmark))
  .catch(handleSaveError);


export const updateStarmark = (starmark) => {
  getStarmarkFolder().then((starmarkFolder) => {
    getStarmarkBookmark(starmark.url)
      .then(([starmarkBookmark]) => {
        starmarkBookmark
          ? updateStarmarkBookmark(starmarkBookmark.id, starmark)
          : createStarmarkBookmark(starmarkFolder.id, starmark);
      });
  });
};


export const getNodeHistory = (url, history) => {
  if (history[url]) {
    const { visitCount, lastVisitTime } = history[url];
    return { visitCount, lastVisitTime };
  }
  return {};
};

export const treeRecurse = (nodes, process, parents = []) => {
  let state = { starmarks: {}, tags: {} };
  let childrenState = { starmarks: {}, tags: {} };
  nodes.forEach((node) => {
    if (node.url) {
      const starmark = process(node, parents);
      state.starmarks[starmark.url] = starmark;
    } else if (node.title) {
      state.tags[node.id] = process(node, parents);
    }
    if (node.children) {
      const parent = node.title ? node : [];
      childrenState = treeRecurse(node.children, process, parents.concat(parent));
    }
    state = {
      starmarks: { ...state.starmarks, ...childrenState.starmarks },
      tags: { ...state.tags, ...childrenState.tags }
    };
  });
  return { starmarks: { ...state.starmarks }, tags: { ...state.tags } };
};

export const nodeToTag = ({ title, id, parentId }) => ({ title, id, parentId });
export const nodeToStarmark = ({ url, dateAdded, id, parentId, title }, parents) => ({ url, dateAdded, id, bookmarkIds: [id], parentId, title, tags: _.map(parents, 'id'), rating: 1 });

const treeToState = (historyArray, state = { starmarks: {}, tags: {} }) => {
  const history = _.keyBy(historyArray, 'url');
  // let localStarmark;
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
        // const { url } = persistentStarmark;
        // localStarmark = { ...state.starmarks[url] };
        // localStarmark.id = persistentStarmark.id = node.id;
        return persistentStarmark;
      }
      //if exists only check for extra ids
      const existingStarmark = state.starmarks[node.url];
      if (existingStarmark) {
        if (!_.includes(existingStarmark.bookmarkIds, node.id)) {
          return { ...existingStarmark, bookmarkIds: [...existingStarmark.bookmarkIds, node.id] };
        }
        return existingStarmark;
      }
      persistentStarmark = { ...nodeToStarmark(node, parents), ...getNodeHistory(node.url, history) };
      return persistentStarmark;
    } else if (node.title) {
      const tag = nodeToTag(node);
      return tag;
    }
  };
};

const getStarmarkBookmarks = () => getStarmarkFolder()
  .then(folder => chrome.bookmarks.getSubTreeAsync(folder.id));

export const loadState = () => {
  return getHistory()
    .then((history) => {
      return getStarmarkBookmarks().then((starmarkNodes) => {
        return treeRecurse(starmarkNodes, treeToState(history));
      }).then((starmarkState) => {
        return chrome.bookmarks.getTreeAsync().then((nodes) => {
          const state = treeRecurse(nodes, treeToState(history, starmarkState));
          console.log(state)
          return state;

        });
      });
    });
};

export const backgroundStateRefresh = (store) => {
  loadState().then((state) => {
    store.dispatch(TodoActions.addStarmarks(state.starmarks));
    store.dispatch(TodoActions.addTags(state.tags));
  });
};


export default treeRecurse;

// const treeRecurse = (nodes, parentNodes) => {
//   let urlHash = {};
//   const parents = parentNodes || [];
//   nodes.forEach((node) => {
//     urlHash[node.id] = { ...node, parents };
//     const childHash = node.children ? treeRecurse(node.children, parents.concat(node)) : {};
//     urlHash = { ...urlHash, ...childHash };
//   });
//   return urlHash;
// };

// const treeToHash = (nodes, callback) => {
//   const hash = treeRecurse(nodes);
//   const state = hashToState(hash);
//   debugger
//   callback(state);
// };
