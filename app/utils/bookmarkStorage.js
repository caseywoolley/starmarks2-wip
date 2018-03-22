
import _ from 'lodash';
import Promise from 'bluebird';
import * as TodoActions from '../../app/actions/todos';

const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });
require('../../app/utils/promisifyChrome');

export const encodeState = state => encodeURIComponent(JSON.stringify(state));
export const decodeState = state => JSON.parse(decodeURIComponent(state || '{}'));

export const saveState = (state) => {
  chrome.storage.local.set({ state: encodeState(state) });
};

export const getState = (callback) => {
  chrome.storage.local.get('state', data => callback(decodeState(data.state)));
};

const storageFolderTitle = 'Starmarks Data';
const urlBase = 'http://www.starmarks.com/?starmark=';
const buildStarmarkUrl = state => `${urlBase}${encodeState(state)}`;
const buildStorageFolder = () => ({
  parentId: '1',
  title: storageFolderTitle
});

export const getAllHistory = () => chrome.history.searchAsync({ text: '', startTime: 0, maxResults: 0 });
const getUrlHistory = url => chrome.history.searchAsync({ text: url }).then(([history]) => history);
const createStarmarkFolder = _.memoize(() => chrome.bookmarks.createAsync(buildStorageFolder()));
const getStarmarkFolder = () => chrome.bookmarks.searchAsync({ title: storageFolderTitle })
  .then(([starmarkFolder]) => starmarkFolder || createStarmarkFolder());

const findBookmarkByUrl = url => chrome.bookmarks.searchAsync({ title: url })
  .then(([bookmark]) => bookmark);

const handleSaveError = err => console.log(err);
const updateBookmarkById = (id, update) => chrome.bookmarks.updateAsync(id, update)
  .then(updatedBookmark => console.log('udpated bookmark', updatedBookmark))
  .catch(handleSaveError);

const createStarmarkBookmark = (parentId, starmark) => chrome.bookmarks
  .createAsync({ parentId, title: starmark.url, url: buildStarmarkUrl(starmark) })
  .then(newBookmark => console.log('created bookmark', newBookmark))
  .catch(handleSaveError);

export const updateStarmarkBookmark = async (starmark) => {
  const starmarkFolder = await getStarmarkFolder();
  const bookmark = await findBookmarkByUrl(starmark.url);
  return bookmark
    ? updateBookmarkById(bookmark.id, { url: buildStarmarkUrl(starmark) })
    : createStarmarkBookmark(starmarkFolder.id, starmark);
};

export const getNodeHistory = (node, history) => {
  if (history[node.url]) {
    const { visitCount = 0, lastVisitTime = 0 } = history[node.url];
    return { visitCount, lastVisitTime };
  } else if (history[node.title]) {
    const { visitCount = 0, lastVisitTime = 0 } = history[node.title];
    return { visitCount, lastVisitTime };
  }
  return { visitCount: 0, lastVisitTime: 0 };
};

export const nodeToTag = ({ title, id, parentId }) => ({ title, id, parentId });
export const nodeToStarmark = ({ url, dateAdded, id, parentId, title }, parents) => ({ url, dateAdded, id, bookmarkIds: [id], parentId, title, tags: _.map(_.reject(parents, ['id', '0']), 'id'), rating: 1 });
const isDataUrl = url => _.startsWith(url, urlBase);

const dataUrlToStarmark = (url) => {
  const stateJson = url.split('?starmark=')[1];
  const starmark = decodeState(stateJson);
  return { ...starmark, ...getNodeHistory(starmark.title, history) };
};

const getBookmarkTree = () => chrome.bookmarks.getTreeAsync();
const getStarmarkBookmarks = () => getStarmarkFolder()
  .then(folder => chrome.bookmarks.getSubTreeAsync(folder.id));

export const stateRefresh = async (store) => {
  const state = await loadState();
  store.dispatch(TodoActions.addStarmarks(state.starmarks));
  store.dispatch(TodoActions.addTags(state.tags));
};

const treeToHash = (nodes, parentNodes) => {
  let urlHash = {};
  const parents = parentNodes || [];
  nodes.forEach((node) => {
    urlHash[node.id] = { ...node, parents };
    const childHash = node.children ? treeToHash(node.children, parents.concat(node)) : {};
    urlHash = { ...urlHash, ...childHash };
  });
  return urlHash;
};

export const getHistory = async () => {
  //TODO: refactor get history, history might have multiple records per url
  const historyArray = await getAllHistory();
  const history = _.keyBy(historyArray, 'url');
  return history;
};

const bookmarkHashToState = async (hash) => {
  const history = await getHistory();
  const state = { starmarks: {}, tags: {} };
  _.forEach(hash, (node, id) => {
    if (node.url) {
      //return bookmarkStarmark if exists
      const nodeHistory = getNodeHistory(node, history);
      const existingStarmark = { ...state.starmarks[node.url], ...nodeHistory };
      if (isDataUrl(node.url)) {
        const starmark = dataUrlToStarmark(node.url);
        state.starmarks[starmark.url] = { ...starmark, ...nodeHistory };
      } else if (existingStarmark.url) { //if exists in state check for extra ids
        if (!_.includes(existingStarmark.bookmarkIds, node.id)) {
          const starmark = { ...existingStarmark, bookmarkIds: [...existingStarmark.bookmarkIds, node.id] };
          state.starmarks[starmark.url] = starmark;
        }
      } else { //turn bookmark into starmark
        const starmark = { ...nodeToStarmark(node, node.parents), ...nodeHistory };
        state.starmarks[starmark.url] = starmark;
      }

      // ...getNodeHistory(node.url, history)
    } else if (node.title) {
      const tag = nodeToTag(node);
      state.tags[tag.id] = tag;
    }
  });
  return state;
};

const loadState = async () => {
  const bookmarkTree = await getBookmarkTree();
  const bookmarkHash = treeToHash(bookmarkTree);
  const state = await bookmarkHashToState(bookmarkHash);
  debugger
  return state;
};
