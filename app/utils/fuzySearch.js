import Fuse from 'fuse.js';

const standardOptions = {
  // shouldSort: true,
  //tokenize: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [{
    name: 'title',
    weight: 0.5
  },
  {
    name: 'tags.title',
    weight: 0.3
  },
  {
    name: 'url',
    weight: 0.2
  }]
};

export default (list, options = {}) => new Fuse(list, { ...standardOptions, ...options });
