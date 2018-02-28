import _ from 'lodash';
import Promise from 'bluebird';

const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });
// chrome.history.search = promisify(chrome.history.search);

const baseUrl = chrome.runtime.getURL('');
const storageFolderTitle = `Starmarks Data (Don't Remove) - ${baseUrl}`;

const buildStarmarkTitle = starmark => `Starmarks Data ${starmark.bookmarkIds[0]} - ${baseUrl}`;
const buildStarmarkUrl = state => `${baseUrl}?starmark=${encodeURIComponent(JSON.stringify(state))}`;
const buildStorageFolder = () => ({
  parentId: '1',
  title: storageFolderTitle
});

// const buildStarmarkFolder = (state, parentId) => ({
//   parentId,
//   title: buildStarmarkUrl(state)
// });


const createStarmark = (starmark, parentId, callback) => {
  chrome.bookmarks.search({ title: buildStarmarkTitle(starmark) }, (bookmarks) => {
    if (!bookmarks[0]) {
      chrome.bookmarks.create({ parentId, title: buildStarmarkTitle(starmark), url: buildStarmarkUrl(starmark) }, callback);
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
const middleStep = (starmarks, parentId, callback) => {
  const updatedStarmarks = { ...starmarks };
  const total = Object.keys(updatedStarmarks).length;
  let count = 0;
  _.forEach(updatedStarmarks, (starmark, i) => {
    const { url, title } = starmark;
    createStarmark(starmark, parentId, (newBookmark) => {
      updatedStarmarks[url].id = newBookmark.id;
      count += 1;
      if (count === total) {
        callback(updatedStarmarks);
      }
    });
  });
};

const saveStarmarkBookmarks = (starmarks, resolve) => {
  chrome.bookmarks.search({ title: storageFolderTitle }, (folder) => {
    if (!folder[0]) {
      chrome.bookmarks.create(buildStorageFolder(), (newFolder) => {
        middleStep(starmarks, newFolder.id, resolve);
      });
    } else {
      middleStep(starmarks, folder[0].id, resolve);
    }
  });
};

const mapHistory = (starmarks, resolve) => {
  const updatedStarmarks = { ...starmarks };
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
    resolve(updatedStarmarks);
  });
};

const treeRecurse = (nodes, tags) => {
  let urlHash = {};
  nodes.forEach((node) => {
    const newTag = [];
    const { url, dateAdded, id, parentId, title } = node;
    const starmark = { title, url, bookmarkIds: [id], parentId, dateAdded, tags, lastVisitTime: 0, visitCount: 0 };
    const folder = { id, parentId, title };

    if (url && title !== 'starmarkData') {
      urlHash[url] ? urlHash[url].bookmarkIds.push(id) : urlHash[url] = starmark;
    } else if (title) {
      newTag.push(folder);
    }
    const childHash = (node.children && title !== storageFolderTitle) ? treeRecurse(node.children, tags.concat(newTag)) : {};
    if (title === storageFolderTitle) {
      debugger
    }
    urlHash = { ...urlHash, ...childHash };
  });
  return urlHash;
};

const treeToHash = (nodes, callback) => {
  const tags = [];
  const urlHash = treeRecurse(nodes, tags);
  callback(urlHash);
};

const bookmarksToUrlHash = promisify(treeToHash);
const mapBookmarkHistory = promisify(mapHistory);
const starmarksToBookmarks = promisify(saveStarmarkBookmarks);

const bookmarksToStarmarks = nodes => bookmarksToUrlHash(nodes)
                                        .then(mapBookmarkHistory)
                                        .then(starmarksToBookmarks)
                                        .tap(console.log.bind(console));

export default bookmarksToStarmarks;
