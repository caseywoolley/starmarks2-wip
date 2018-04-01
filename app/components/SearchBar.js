import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import style from './SearchBar.css';


const searchParams = [
  { key: 'stars', name: 'Rating', placeholder: 'ex 5, 2-4, 3+' },
  { key: 'visits', name: 'Visits', placeholder: 'ex 1-5, 20+, 2' },
  { key: 'dateAdded', name: 'Date Added', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  { key: 'lastVisit', name: 'Last Visited', placeholder: 'ex 2012+, 1/16/15 - 5/18/15' },
  { key: 'tags', name: 'Tags', suggestedValues: [], placeholder: 'ex tag1, tag2 ...' },
  { key: 'title', name: 'Title', placeholder: 'Title...' },
  { key: 'url', name: 'Url', placeholder: 'Url...' }
];

const keyCodes = {
  tab: 9,
  backspace: 8
};

export default class SearchBar extends Component {

  static propTypes = {
    addFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    foundCount: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedParam: -1
    };
  }

  searchKeyHandlers = {
    [keyCodes.tab]: (e) => {
      const { filters, addFilters } = this.props;
      e.preventDefault();
      const name = e.target.value.trim();
      const updates = { query: '' };
      if (name !== '') {
        updates.params = [...(filters.params || []), { name }];
        this.setState({ selectedParam: (this.params || []).length });
      }
      addFilters(updates);
    },
    [keyCodes.backspace]: (e) => {
      const { filters } = this.props;
      if (filters.query === '' && this.lastParamInput) {
        e.preventDefault();
        this.lastParamInput.focus();
      }
    }
  };

  paramKeyHandlers = {
    [keyCodes.tab]: (e, index) => {
      const { filters } = this.props;
      e.preventDefault();
      const param = filters.params[index];
      if (!param.value || param.value === '') {
        this.handleRemoveTag(index);
      }
      this.searchInput.focus();
    },
    [keyCodes.backspace]: (e, index) => {
      const { filters, addFilters } = this.props;
      const param = filters.params[index];
      if (!param.value || param.value === '') {
        e.preventDefault();
        addFilters({
          params: (filters.params || []).slice(0, -1)
        });
        this.searchInput.focus();
      }
    }
  };

  componentDidMount() {
    this.searchInput.focus();
  }

  handleChange = (e) => {
    this.props.addFilters({ query: e.target.value });
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

  handleParamKeyDown = (e, index) => {
    const keyHandler = this.paramKeyHandlers[e.keyCode];
    if (keyHandler) {
      keyHandler(e, index);
    }
  }

  handleRemoveTag = (index) => {
    const { filters, addFilters } = this.props;
    addFilters({
      params: filters.params.filter((item, i) => i !== index)
    });
    this.searchInput.focus();
  }

  handleClickParam = (index) => {
    this.setState({
      selectedParam: index
    });
  }

  isSelectedParam = (index) => {
    const { selectedParam } = this.state;
    return selectedParam === index;
  }

  setParamValue = (e, i) => {
    const { filters, addFilters } = this.props;
    const value = e.target.value.trim();
    // if (value !== '') {
    const updatedParam = { ...filters.params[i], value };
    addFilters({
      params: [...filters.params.slice(0, i), updatedParam, ...filters.params.slice(i + 1)]
    });
  }

  setLastParamInput = (input, i) => {
    const paramsLength = _.get(this, 'props.filters.params', []).length;
    if (i === paramsLength - 1) {
      this.lastParamInput = input;
      this.selectedParam = i;
    } else {
      this.lastParamInput = null;
    }
  };

  render() {
    const { foundCount, filters } = this.props;
    return (
      <div className={style.searchContainer}>
        <div className={style.searchBar}>
          {(filters.params || []).map((param, i) =>
            <li key={i} className={style.params} onClick={() => this.handleClickParam(i)}>
              <span>{param.name}</span>
              <input
                type="text"
                ref={input => this.setLastParamInput(input, i)}
                onClick={(e) => { e.stopPropagation(); }}
                autoFocus={() => this.isSelectedParam(i)}
                onFocus={this.handleFocus}
                onChange={e => this.setParamValue(e, i)}
                onKeyDown={e => this.handleParamKeyDown(e, i)}
                value={param.value}
              />
              <span onClick={() => this.handleRemoveTag(i)}>x</span>
            </li>
          )}
          <input
            type="text"
            ref={(input) => { this.searchInput = input; }}
            onChange={this.handleChange}
            onKeyDown={this.handleSearchKeyDown}
            onFocus={this.handleFocus}
            value={filters.query}
          />
        </div>
        <div className={style.foundCount}>{foundCount} Found</div>
        <div><pre className={style.pre}>{JSON.stringify(filters, null, 2) }</pre></div>
        <div><pre className={style.pre}>{this.state.selectedParam}</pre></div>
      </div>
    );
  }
}
