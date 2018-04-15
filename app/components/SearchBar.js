import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { searchFilters, getFilter } from '../utils/searchResults';
import * as TodoActions from '../actions/todos';
import style from './SearchBar.css';

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

  addNewFilter = (e) => {
    const { resetQuery, addFilter } = this.props.actions;
    const { search } = this.props;
    e.preventDefault();
    resetQuery();
    const selectedFilter = searchFilters(search.query)[0];
    if (selectedFilter) {
      addFilter({ [selectedFilter.key]: '' });
    }
    this.searchInput.focus();
  }

  selectLastFilterInput = (e) => {
    const { search } = this.props;
    if (search.query === '') {
      e.preventDefault();
      this.getCurrentInput().focus();
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
    // this.debouncedUpdate = _.debounce(this.props.actions.updateSearch, 50);
  }

  handleChange = (e) => {
    this.props.actions.updateSearch({ query: e.target.value });
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
    const { updateFilter } = this.props.actions;
    const value = e.target.value;
    updateFilter({ [key]: value });
  }

  setLastFilterInput = (input) => {
    this.lastFilterInput = input;
  };

  render() {
    const { foundCount, search } = this.props;
    return (
      <div className={style.fixedHeader}>
        <div className={style.searchContainer}>
          <div className={style.searchBar}>
            <div className={style.searchItems}>
              <ul className={style.filtersContainer}>
                {_.map((search.filters || {}), (val, key) =>
                  <li key={key} className={style.filters} onClick={() => this.handleClickFilter(key)}>
                    <span>{getFilter(key).name}</span>
                    <input
                      type="text"
                      ref={input => this.setLastFilterInput(input, key)}
                      onClick={(e) => { e.stopPropagation(); }}
                      autoFocus="true"
                      onFocus={this.handleFocus}
                      onBlur={e => this.removeFilterIfEmpty(e, key)}
                      onChange={e => this.setFilterValue(e, key)}
                      onKeyDown={e => this.handleFilterKeyDown(e, key)}
                      placeholder={getFilter(key).placeholder}
                      value={search.filters[key]}
                    />
                    <span onClick={() => this.handleRemoveFilter(key)}>x</span>

                  </li>
                )}
              </ul>
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
                  {_.map(searchFilters(search.query), result =>
                    <div key={result.key}>{result.name}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
            <div className={style.foundCount}>{foundCount} Found</div>
            <div><pre className={style.pre}>{JSON.stringify(search, null, 2) }</pre></div>
            <div><pre className={style.pre}>{JSON.stringify(searchFilters(search.query), null, 2) }</pre></div>
        </div>
      </div>
    );
  }
}
