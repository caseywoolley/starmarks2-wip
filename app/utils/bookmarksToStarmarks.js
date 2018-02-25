import _ from 'lodash';
import Promise from 'bluebird';

const promisify = fn => (...args) => new Promise((resolve) => { fn(...args, resolve); });
// chrome.history.search = promisify(chrome.history.search);

const mapHistory = (starmarks, resolve) => {
  const updatedStarmarks = { ...starmarks };
  chrome.history.search({ text: '', startTime: 0, maxResults: 0 }, (history) => {
    if (history[0]) {
      const histKeys = _.keyBy(history, 'url')
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
    const starmark = { title, url, id, parentId, dateAdded, tags, lastVisitTime: 0, visitCount: 0 };
    const folder = { id, parentId, title };

    if (url) {
      urlHash[url] = starmark;
    } else if (title) {
      newTag.push(folder);
    }
    const childHash = node.children ? treeRecurse(node.children, tags.concat(newTag)) : {};
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

const bookmarksToStarmarks = nodes => bookmarksToUrlHash(nodes)
                                        .then(mapBookmarkHistory)
                                        .tap(console.log.bind(console));

export default bookmarksToStarmarks;
