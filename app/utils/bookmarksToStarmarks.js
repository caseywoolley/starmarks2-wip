import _ from 'lodash';
import _fp from 'lodash/fp';
import Promise from 'bluebird';

const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });
// chrome.history.search = promisify(chrome.history.search);

const baseUrl = chrome.runtime.getURL('');
const storageFolderTitle = 'Starmarks Data';

const buildStarmarkTitle = starmark => `Starmarks Data ${starmark.bookmarkIds[0]} - ${baseUrl}`;
const buildStarmarkUrl = state => `http://www.starmarks.com?starmark=${encodeURIComponent(JSON.stringify(state))}`;
const buildStorageFolder = () => ({
  parentId: '1',
  title: storageFolderTitle
});

// const buildStarmarkFolder = (state, parentId) => ({
//   parentId,
//   title: buildStarmarkUrl(state)
// });


const createStarmark = (starmark, parentId, url, callback) => {
  chrome.bookmarks.search({ title: url }, (bookmarks) => {
    if (!bookmarks[0]) {
      chrome.bookmarks.create({ parentId, title: url, url: buildStarmarkUrl(starmark) }, callback);
    } else {
      callback(bookmarks[0]);
    }
  });
};

export const updateStarmark = (starmark) => {
  chrome.bookmarks.search({ title: storageFolderTitle }, (folder) => {
    if (folder[0]) {
      chrome.bookmarks.update(starmark.id, { url: buildStarmarkUrl(starmark) }, (bookmark) => {
        console.log('saved bookmark', bookmark);
      });
    }
  });
};

// export const saveStarmark = (starmark, callback) => {
//   chrome.bookmarks.search({ title: storageFolderTitle }, (folder) => {
//     if (!folder[0]) {
//       chrome.bookmarks.create(buildStarmarkFolder, (newFolder) => {
//         createStarmark(starmark, newFolder.id, newBookmark => callback(newBookmark));
//       });
//     }
//     createStarmark(starmark, folder[0].id, newBookmark => callback(newBookmark));
//   });
// };

// change to reduce rather than foreach
const middleStep = (state, parentId, callback) => {
  const updatedStarmarks = { ...state.starmarks };
  const total = Object.keys(updatedStarmarks).length;
  let count = 0;
  _.forEach(updatedStarmarks, (starmark, url) => {
    // const { url, title } = starmark;
    createStarmark(starmark, parentId, url, (newBookmark) => {
      updatedStarmarks[url].id = newBookmark.id;
      count += 1;
      if (count === total) {
        callback({ ...state, starmarks: updatedStarmarks });
      }
    });
  });
};

const saveStarmarkBookmarks = (state, resolve) => {
  chrome.bookmarks.search({ title: storageFolderTitle }, (folder) => {
    if (!folder[0]) {
      chrome.bookmarks.create(buildStorageFolder(), (newFolder) => {
        middleStep(state, newFolder.id, resolve);
      });
    } else {
      middleStep(state, folder[0].id, resolve);
    }
  });
};

const mapHistory = (state, resolve) => {
  const updatedStarmarks = { ...state.starmarks };
  chrome.history.search({ text: '', startTime: 0, maxResults: 0 }, (history) => {
    if (history[0]) {
      const histKeys = _.keyBy(history, 'url');
      _.forEach(updatedStarmarks, (starmark, url) => {
        if (histKeys[url]) {
          const { visitCount, lastVisitTime } = histKeys[url];
          updatedStarmarks[url] = { ...starmark, visitCount, lastVisitTime };
        }
      });
    }
    resolve({ ...state, starmarks: updatedStarmarks });
  });
};

const treeRecurse = (nodes, parentNodes) => {
  let urlHash = {};
  const parents = parentNodes || [];
  nodes.forEach((node) => {
    urlHash[node.id] = { ...node, parents };
    const childHash = node.children ? treeRecurse(node.children, parents.concat(node)) : {};
    urlHash = { ...urlHash, ...childHash };
  });
  return urlHash;
};

const treeToHash = (nodes, callback) => {
  const hash = treeRecurse(nodes);
  const state = hashToState(hash);
  debugger
  callback(state);
};

const nodesToStarmarks = (starmarks, { url, dateAdded, id, parentId, title }) => {
  const result = { ...starmarks };
  if (url && result[url]) {
    result[url].bookmarkIds.push(id);
  } else if (url) {
    result[url] = { url, dateAdded, bookmarkIds: [id], parentId, title };
  }
  return result;
};

const isStoredStarmark = (node) => {
  return _.get(_.last(node.parents), 'title') === storageFolderTitle;
};

const isStateBookmark = node => node.title === 'starmarksData';

const jsonToState = (starmarks, node) => {
  const stateJson = node.url.split('?starmark=')[1];
  const starmark = JSON.parse(decodeURIComponent(stateJson));
  return { ...starmarks, [starmark.url]: starmark };
};

const urlToState = (state, node) => {
  const stateJson = node.url.split('?data=')[1];
  return JSON.parse(decodeURIComponent(stateJson));
};

const hashToStarmark = ({ url, dateAdded, id, parentId, parents, title }) => {
  const tags = _.map(parents, 'id');
  return { url, dateAdded, id, bookmarkIds: [id], parentId, title, tags };
};

const hashToTags = (tags, { id, parentId, title }) => {
  const results = { ...tags };
  if (!results[id]) {
    results[id] = { id, parentId, title };
  }
  return results;
};

const noDuplicates = (starmarks, node) => {
  const result = { ...starmarks };
  if (result[node.url] && !_.includes(result[node.url].bookmarkIds, node.id)) {
    result[node.url].bookmarkIds.push(node.id);
  } else {
    result[node.url] = node;
  }
  return result;
};

const hashToState = (hash) => {
  const state = _(hash)
                .filter(isStateBookmark)
                .reduce(urlToState, {});
  const starmarks = _(hash)
                    .filter(isStoredStarmark)
                    .reject(isStateBookmark)
                    .reduce(jsonToState, {});
  const newStarmarks = _(hash)
                        .reject(isStoredStarmark)
                        .reject(isStateBookmark)
                        .filter(node => node.url)
                        .map(hashToStarmark)
                        .reduce(noDuplicates, {});
  const tags = _(hash)
                .reject(node => node.url)
                .reduce(hashToTags, {});

  _.forEach(newStarmarks, (newStarmark, url) => {
    if (starmarks[url]) {
      starmarks[url].bookmarkIds = newStarmark.bookmarkIds;
      starmarks[url].tags = newStarmark.tags;
      starmarks[url].url = newStarmark.url;
    } else {
      starmarks[url] = newStarmark;
    }
  });
  return { ...state, starmarks, tags };
};


// const stateCollector = (state, filter, collect) => {
//   const get = () => ({ ...state });
//   const process = (node) => { if (filter(node)) { collect(node) } }
//   return { get, process }
// };

// const starmarkCollector = stateCollector(
//   {},
//   (node) => isStoredStarmark(node) && !isStateBookmark(node),
//   (node) =>
// )

// const stateReducer = () => {
//   let state = {};
//   let starmarks = {};
//   let tags = {};

//   const isNewTag = node => !node.url && node.title;

//   const addTag = ({ id, parentId, title }) => (tags[id] = { id, parentId, title });
//   const isStarmark = node => node.url;
//   const addStarmark = ({ url, dateAdded, id, parentId, title }) => {
//     starmarks[url] ? starmarks[url] = { title, url, bookmarkIds: [id], parentId, dateAdded, tags } : (starmarks[url].bookmarkIds.push(id));
//   };
//   const get = () => ({ ...state });
//   const process = (node) => {
//     tags = isNewTag(node) ?
//   }
//   return {
//     get,
//     process: (node) => {
//       if (isTag(node) && !tags[node.id]) {
//         addTag(node);
//       }
//       if (isStarmark(node) && !starmarks[node.url]) {
//         addStarmark(node);
//       }
//     },
//   };
// };

// const treeToState = (nodes, callback) => {
//   const tags = [];
//   const reducers = [tags(), starmarks, state];
//   const urlHash = treeRecurse(nodes, tags);
//   callback(urlHash);
// };

//hash split
//hash to starmarks

const folderToHash = (folderName, callback) => {
  chrome.bookmarks.search({ title: folderName }, (folders) => {
    if (folders[0]) {
      chrome.bookmarks.getSubTree(folders[0].id, (nodes) => {
        treeToHash(nodes, callback);
      });
    }
  });
};

const isStarmark = starmark => _.indexOf(starmark.tags, storageFolderTitle) !== -1;

// const hashToState = (hash, callback) => {
//   const tempHash = { ...hash };
//   const starmarks = _.pickBy(tempHash, isStarmark);
//   const state = _.remove(starmarks, { title: 'starmarksData' });
// }

const bookmarksToUrlHash = promisify(treeToHash);
const folderToUrlHash = promisify(folderToHash);
const mapBookmarkHistory = promisify(mapHistory);
const starmarksToBookmarks = promisify(saveStarmarkBookmarks);

const loadStarmarks = () => folderToUrlHash(storageFolderTitle)
                              .then(addNewBookmarks)

const bookmarksToStarmarks = nodes => bookmarksToUrlHash(nodes)
                                        .then(mapBookmarkHistory)
                                        // .then(starmarksToBookmarks)
                                        .tap(console.log.bind(console));

export default bookmarksToStarmarks;
