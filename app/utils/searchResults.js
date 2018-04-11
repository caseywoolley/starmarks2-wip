import _ from 'lodash';

  // full search x
  // field search x
  // array search (tags) x
  // range search (dates, ratings)
const strToRange = str => str.split(/[ -]+/);
const filterRange = (arr, field, range) => _.filter(arr, item => _.inRange(item[field], range.min, range.max));


const containsString = (str, testStr) => _.includes(str.toLowerCase(), testStr.toLowerCase());
const hasStringMatch = (node, str, keys, key, include) => include && _.isString(node) && containsString(node, str);
const hasChildren = node => _.isPlainObject(node) || _.isArray(node);

const findStringInChildren = (node, str, keys, key, include) => {
  if (hasChildren(node)) {
    return _.some(node, (child, key) => findStringInObj(child, str, keys, key, (include || _.includes(keys, key))));
  }
};

const findStringInObj = (node, str, keys, key, include) => hasStringMatch(node, str, keys, key, include) || findStringInChildren(node, str, keys, key, include);

export const findMatch = (items, query, keys) => (query ? _.filter(items, item => findStringInObj(item, query, keys)) : []);

const filterStarmarks = (starmarks, tags, search) => {
  let results = _.toArray(starmarks);
  results = _.map(results, starmark => ({
    ...starmark,
    tags: _.map(starmark.tags, id => (tags[id] || { id })),
  }));
  const query = _.get(search, 'query', '').trim();
  // if ((search.params || []).length) {
  //   _.forEach(search.params, (param) => {
  //     if (param.name === 'rating') {
  //       //filter ratings
  //     }
  //   });
  // }
  if (query) {
    // results = fuzyStarmarks.search(query);
    // results = fuzy(results).search(query);
    // _.forEach(filterFunctions, (func, field) => {
    //   results = func(results, query, field);
    // });
    results = _.filter(results, item => findStringInObj(item, query, ['title', 'tags', 'url']));
  }
  _.forEach(search.filters, (val, key) => {
    if (val) {
      // results = filterFunctions[key](results, val, key);
      results = _.filter(results, item => findStringInObj(item, val, [key]));
    }
  });
      // .concat(fuzy(results, { keys: ['tags.title'] }).search(query));

    // results = _.filter(results, result => _.some(result, field => (_.isString(field)
    //     ? containsString(field, query)
    //     : _.some(field, val => containsString(val, query)))));
  results = _.sortBy(results, search.sortBy);
  return search.reverse ? results.reverse() : results;
  //.filter((starmark) => {
  //   return true //_.find(starmark.tags, tag => tag.title.includes(search));
  // });
};

export default filterStarmarks;
