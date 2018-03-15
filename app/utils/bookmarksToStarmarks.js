import _ from 'lodash';
import Promise from 'bluebird';

const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });

const storageFolderTitle = 'Starmarks Data';
const urlBase = 'http://www.starmarks.com/?starmark=';
const buildStarmarkUrl = state => `${urlBase}${encodeURIComponent(JSON.stringify(state))}`;
const buildStorageFolder = () => ({
  parentId: '1',
  title: storageFolderTitle
});

const getStarmarkFolder = (callback) => {
  chrome.bookmarks.search({ title: storageFolderTitle }, (folder) => { callback(folder[0]); });
};


export const updateStarmark = (starmark) => {
  getStarmarkFolder((folder) => {
    if (folder) {
      chrome.bookmarks.search({ title: starmark.url }, (foundBookmarks) => {
        if (foundBookmarks[0]) {
          chrome.bookmarks.update(foundBookmarks[0].id, { url: buildStarmarkUrl(starmark) }, (bookmark) => {
            console.log('saved bookmark', bookmark);
          });
        } else {
          chrome.bookmarks.create({ parentId: folder.id, title: starmark.url, url: buildStarmarkUrl(starmark) }, (newBookmark) => {
            console.log('created bookmark', newBookmark);
          });
        }
      });
    } else {
      chrome.bookmarks.create(buildStorageFolder(), (newFolder) => {
        console.log('created folder', newFolder);
      });
    }
  });
};

export const getHistory = () => chrome.history.searchAsync({ text: '', startTime: 0, maxResults: 0 });
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
      state.starmarks[node.url] = process(node, parents);
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

export default treeRecurse;
