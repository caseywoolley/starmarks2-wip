import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import searchResults from '../utils/searchResults';
import * as TodoActions from '../actions/todos';

import StarmarkTextInput from '../components/StarmarkTextInput';
import StarSelector from '../components/StarSelector';
import SearchBar from '../components/SearchBar';
import SideBar from '../components/SideBar';
import StarList from '../components/StarList';
import style from './App.css';

const isPopup = window.location.pathname === '/popup.html';
let activeTab;
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  // activeTab = tabs[0];
});

let resultCache = [];
const debouncedSearch = _.throttle(searchResults, 100, { leading: true, trailing: false });
const debouncedResults = (starmarks, tags, search) => {
  const results = debouncedSearch(starmarks, tags, search);
  if (results) {
    resultCache = results;
  }
  return results || resultCache;
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
      isEditing: false,
      selection: []
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

  setSelection = (selection) => {
    this.setState({ selection });
  }

  render() {
    const { starmarks, tags, search, actions } = this.props;
    const { isEditing, selection } = this.state;
    const starmark = {} //activeTab ? starmarks[activeTab.url] || {}: activeTab;
    const results = debouncedResults(starmarks, tags, search);
    // const starmark = results[0];
    return (
      <div >
        { !isPopup &&
          <div className={style.container}>
            <SearchBar updateSearch={actions.updateSearch} search={search} foundCount={results.length} selection={selection} />
            <SideBar selection={selection} />
            <div className={style.main}>
              {/* <div className={style.tagsSpacer} /> */}
              <StarList results={results} starmarks={starmarks} tags={tags} search={search} actions={actions} setSelection={this.setSelection} />

            </div>
          </div>
        }
        { //isPopup &&
          // <div className={style.popup}>
          //   <div className={style.stars}><StarSelector
          //     starmark={{ title: starmark.title, rating: starmark.rating, url: activeTab.url }}
          //     addStarmark={actions.addStarmark}
          //   /></div>
          //   { !isEditing
          //       ? <div onDoubleClick={() => this.setState({ isEditing: true })}>{starmark.title}</div>
          //       : <StarmarkTextInput text={starmark.title} onSave={this.onSave} />
          //   }
          //   <div>{activeTab.url}</div>
          //   <button onClick={this.seeStars}>Explore Starmarks</button>
          // </div>
        }
      </div>
    );
  }
}
