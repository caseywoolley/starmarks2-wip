import _ from 'lodash';

const filterOptions = [
  { key: 'rating', name: 'Rating', placeholder: 'ex 5, 2-4, 3+', isRange: true },
  { key: 'visitCount', name: 'Visits', placeholder: 'ex 1-5, 20+, 2', isRange: true },
  { key: 'dateAdded', name: 'Added', placeholder: 'ex 2012+, 1/16/15 - 5/18/15', isRange: true, isDate: true },
  { key: 'lastVisitTime', name: 'Visited', placeholder: 'ex 2012+, 1/16/15 - 5/18/15', isRange: true, isDate: true },
  { key: 'tags', name: 'Tags', suggestedValues: [], placeholder: 'ex tag1, tag2 ...' },
  { key: 'title', name: 'Title', placeholder: 'Title...' },
  { key: 'url', name: 'Url', placeholder: 'Url...' }
];

const getRangeFilters = _.reduce(filterOptions, (keys, filter) => (filter.isRange ? [...keys, filter.key] : keys), []);
const getTextFilters = _.reduce(filterOptions, (keys, filter) => (!filter.isRange ? [...keys, filter.key] : keys), []);

const strToRange = (str, isDate) => {
  const [first, second] = str.split(/[x^+-]/);
  const [min, max] = isDate
    ? [Date.parse(first), Date.parse(second)]
    : [parseInt(first, 10), parseInt(second, 10)];
  const plusMax = _.includes(str, '+') ? Number.MAX_SAFE_INTEGER : max;
  return { min: (min || 0), max: (max || plusMax || min) };
};

const containsString = (str, testStr) => _.includes(str.toLowerCase(), testStr.toLowerCase());
const hasStringMatch = (node, str, keys, key, include) => include && _.isString(node) && containsString(node, str);
const hasChildren = node => _.isPlainObject(node) || _.isArray(node);
const findStringInChildren = (node, str, keys, key, include) => {
  if (hasChildren(node)) {
    return _.some(node, (child, key) => findStringInObj(child, str, keys, key, (include || _.includes(keys, key))));
  }
};
const findStringInObj = (node, str, keys, key, include) => hasStringMatch(node, str, keys, key, include) || findStringInChildren(node, str, keys, key, include);

export const getFilter = _.memoize(key => filterOptions.filter(filter => filter.key === key)[0]);
export const searchFilters = filterName => findMatches(filterOptions, filterName, ['name']);
export const findMatches = (items, query, keys) => (query ? _.filter(items, item => findStringInObj(item, query, keys)) : []);
const filterRange = (arr, val, field, isDate) => _.filter(arr, (item) => {
  const range = isDate ? strToRange(val, true) : strToRange(val);
  return item[field] && item[field] >= range.min && item[field] <= range.max;
});

const starmarksToResults = (starmarks, tags) => _.reduce(starmarks, (results, starmark) => {
  results.push({
    ...starmark,
    tags: _.map(starmark.tags, id => (tags[id] || { id })),
  });
  return results;
}, []);

const getResults = (starmarks, tags, search) => {
  let results = starmarksToResults(starmarks, tags);
  const query = _.get(search, 'query', '').trim();
  if (query) {
    results = findMatches(results, query, getTextFilters);
  }
  _.forEach(filterOptions, (filter) => {
    const filterVal = search.filters[filter.key];
    if (filterVal) {
      results = filter.isRange
        ? filterRange(results, filterVal, [filter.key], filter.isDate)
        : findMatches(results, filterVal, [filter.key]);
    }
  });
  results = _.sortBy(results, search.sortBy);
  return search.reverse ? results.reverse() : results;
};

export default getResults;
