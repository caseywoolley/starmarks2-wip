import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as TodoActions from '../actions/todos';

import StarmarkTextInput from '../components/StarmarkTextInput';
import StarSelector from '../components/StarSelector';
import SearchBar from '../components/SearchBar';
import StarList from '../components/StarList';
import style from './App.css';

const isPopup = window.location.pathname === '/popup.html';
let activeTab;
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  activeTab = tabs[0];
});

const containsString = (str, testStr) => _.includes(str.toLowerCase(), testStr.toLowerCase());
// const findNestedString = (node, str) => {
//   return _.some(node, field => (_.isString(field)
//     ? containsString(field, str) : findNestedString(field)));
// };

//full search
// field search
// array search (tags)
// range search (dates, ratings)
const strToRange = str => str.split(/[ -]+/);
const filterRange = (arr, field, range) => _.filter(arr, item => _.inRange(item[field], range.min, range.max));

const filterStarmarks = (starmarks, search) => {
  let results = _.sortBy(_.toArray(starmarks), search.sortBy);
  const query = _.get(search, 'query', '').trim();
  if ((search.params || []).length) {
    _.forEach(search.params, (param) => {
      if (param.name === 'rating') {
        //filter ratings
      }
    });
  }
  if (query) {
    results = _.filter(results, result => _.some(result, field => (_.isString(field)
        ? containsString(field, query)
        : _.some(field, val => containsString(val, query)))));
  }
  return search.reverse ? results.reverse() : results;
  //.filter((starmark) => {
  //   return true //_.find(starmark.tags, tag => tag.title.includes(search));
  // });
};


@connect(
  state => ({
    starmarks: state.starmarks,
    tags: state.tags,
    search: state.search
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    starmarks: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false
    };
  }

  componentDidMount() {
    // const { refreshState } = this.props.actions;
    // chrome.runtime.onMessage.addListener(
    //   (request) => {
    //     if (request.message === 'refreshState') {
    //       refreshState();
    //     }
    //   });
    const { addStarmark } = this.props.actions;
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request.message === 'addStarmark') {
          addStarmark(request.starmark);
          sendResponse({ message: 'saved' });
        }
      });
  }

  onSave = (title) => {
    const starmark = this.props.starmarks[activeTab.url] || activeTab;
    this.props.actions.addStarmark({
      title,
      url: activeTab.url
    });
    this.setState({ isEditing: false });
  }

  seeStars = () => {
    chrome.tabs.create({ url: 'window.html' });
  }

  render() {
    const { starmarks, tags, search, actions } = this.props;
    const { isEditing } = this.state;
    const starmark = activeTab ? starmarks[activeTab.url] : activeTab;
    const results = filterStarmarks(starmarks, search);
    return (
      <div >
        { !isPopup &&
          <div className={style.container}>
            <SearchBar updateSearch={actions.updateSearch} search={search} foundCount={results.length} />
            <StarList results={results} starmarks={starmarks} tags={tags} search={search} actions={actions} />
          </div>
        }
        { isPopup &&
          <div className={style.popup}>
            <div className={style.stars}><StarSelector
              starmark={{ title: starmark.title, rating: starmark.rating, url: activeTab.url }}
              addStarmark={actions.addStarmark}
            /></div>
            { !isEditing
                ? <div onDoubleClick={() => this.setState({ isEditing: true })}>{starmark.title}</div>
                : <StarmarkTextInput text={starmark.title} onSave={this.onSave} />
            }
            <div>{activeTab.url}</div>
            <button onClick={this.seeStars}>Explore Starmarks</button>
          </div>
        }
      </div>
    );
  }
}
