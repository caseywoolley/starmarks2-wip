import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';
import _ from 'lodash';
import * as TodoActions from '../actions/todos';
import style from './SearchBar.css';

const options = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'name'
  ]
};

const searchFiltersArr = [
  { key: 'stars', name: 'Rating', placeholder: 'ex 5, 2-4, 3+' },
  { key: 'visits', name: 'Visits', placeholder: 'ex 1-5, 20+, 2' },
  { key: 'dateAdded', name: 'Date Added', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  { key: 'lastVisit', name: 'Last Visited', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  { key: 'tags', name: 'Tags', suggestedValues: [], placeholder: 'ex tag1, tag2 ...' },
  { key: 'title', name: 'Title', placeholder: 'Title...' },
  { key: 'url', name: 'Url', placeholder: 'Url...' }
];

const getFilter = _.memoize(key => searchFiltersArr.filter(filter => filter.key === key)[0]);

// const searchFilters = {
//   stars: { name: 'Rating', placeholder: 'ex 5, 2-4, 3+' },
//   visits: { name: 'Visits', placeholder: 'ex 1-5, 20+, 2' },
//   dateAdded: { name: 'Date Added', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
//   lastVisit: { name: 'Last Visited', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
//   tags: { name: 'Tags', suggestedValues: [], placeholder: 'ex tag1, tag2 ...' },
//   title: { name: 'Title', placeholder: 'Title...' },
//   url: { name: 'Url', placeholder: 'Url...' }
// };

const allFilters = new Fuse(searchFiltersArr, options);

let selectedKey;

const keyCodes = {
  tab: 9,
  backspace: 8
};

@connect(
  state => ({
    search: state.search
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class SearchBar extends Component {

  static propTypes = {
    updateSearch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    foundCount: PropTypes.number.isRequired
  };

  getCurrentInput = () => (this.lastFilterInput ? this.lastFilterInput : this.searchInput);
  filterIsEmpty = index => !this.props.search.filters[index];
  // getSelectedFilter = query => allFilters.search(query)[0];

  addNewFilter = (e) => {
    const { resetQuery, addFilter } = this.props.actions;
    const { search } = this.props;
    e.preventDefault();
    const filterKey = e.target.value.trim().toLowerCase();
    resetQuery();
    const selectedFilter = allFilters.search(search.query)[0];
    if (selectedFilter) {
      selectedKey = selectedFilter.key;
      addFilter({ [selectedKey]: '' });
    }
    // this.getCurrentInput().focus();
    this.searchInput.focus();
  }

  selectLastFilterInput = (e) => {
    const { search } = this.props;
    if (search.query === '') {
      e.preventDefault();
      this.getCurrentInput().focus();
      // this.lastFilterInput.focus();
    }
  }

  removeFilterIfEmpty = (e, index) => {
    e.preventDefault();
    if (this.filterIsEmpty(index)) {
      this.handleRemoveFilter(index);
    }
    this.searchInput.focus();
  }

  removeFilterIfEmptyOnBackspace = (e, index) => {
    if (this.filterIsEmpty(index)) {
      e.preventDefault();
      this.handleRemoveFilter(index);
    }
  }

  searchKeyHandlers = {
    [keyCodes.tab]: this.addNewFilter,
    [keyCodes.backspace]: this.selectLastFilterInput
  };

  filterKeyHandlers = {
    [keyCodes.tab]: this.removeFilterIfEmpty,
    [keyCodes.backspace]: this.removeFilterIfEmptyOnBackspace
  };

  componentDidMount() {
    this.searchInput.focus();
  }

  handleChange = (e) => {
    this.props.updateSearch({ query: e.target.value });
  }

  handleFocus = (event) => {
    event.target.select();
  }

  handleSearchKeyDown = (e) => {
    const keyHandler = this.searchKeyHandlers[e.keyCode];
    if (keyHandler) {
      keyHandler(e);
    }
  }

  handleFilterKeyDown = (e, index) => {
    const keyHandler = this.filterKeyHandlers[e.keyCode];
    if (keyHandler) {
      keyHandler(e, index);
    }
  }

  handleRemoveFilter = (key) => {
    const { removeFilter } = this.props.actions;
    removeFilter(key);
    this.searchInput.focus();
  }

  handleClickFilter = (index) => {

  }

  setFilterValue = (e, key) => {
    const { search, updateSearch } = this.props;
    const { updateFilter } = this.props.actions;
    const value = e.target.value.trim();
    const updatedFilter = { ...search.filters[key], value };
    updateFilter({ [key]: value });
    // updateSearch({
    //   filters: [...search.filters.slice(0, i), updatedFilter, ...search.filters.slice(i + 1)]
    // });
  }

  setLastFilterInput = (input, key) => {
    // const filtersLength = _.get(this, 'props.search.filters', []).length;
    this.lastFilterInput = input; //(key === selectedKey) ? input : null;
  };

  render() {
    const { foundCount, search } = this.props;
    return (
      <div className={style.searchContainer}>
        <div className={style.searchBar}>
          {_.map((search.filters || {}), (val, key) =>
            <li key={key} className={style.filters} onClick={() => this.handleClickFilter(key)}>
              <span>{getFilter(key).name}</span>
              <input
                type="text"
                ref={input => this.setLastFilterInput(input, key)}
                onClick={(e) => { e.stopPropagation(); }}
                autoFocus="true"
                onFocus={this.handleFocus}
                onChange={e => this.setFilterValue(e, key)}
                onKeyDown={e => this.handleFilterKeyDown(e, key)}
                placeholder={getFilter(key).placeholder}
                value={getFilter(key).value}
              />
              <span onClick={() => this.handleRemoveFilter(key)}>x</span>

            </li>
          )}
          <div className={style.searchBox}>
            <input
              type="text"
              ref={(input) => { this.searchInput = input; }}
              onChange={this.handleChange}
              onKeyDown={this.handleSearchKeyDown}
              onFocus={this.handleFocus}
              value={search.query}
            />
            <div className={style.filterOptions}>
              {_.map(allFilters.search(search.query), result =>
                <div key={result.key}>{result.name}</div>
              )}
            </div>
          </div>
        </div>
        <div className={style.foundCount}>{foundCount} Found</div>
        <div><pre className={style.pre}>{JSON.stringify(search, null, 2) }</pre></div>
        <div><pre className={style.pre}>{JSON.stringify(allFilters.search(search.query), null, 2) }</pre></div>
      </div>
    );
  }
}
