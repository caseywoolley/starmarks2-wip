import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import Header from '../components/Header';
// import MainSection from '../components/MainSection';
import Starmark from '../components/Starmark';
import StarList from '../components/StarList';
import * as TodoActions from '../actions/todos';
import style from './App.css';

const isPopup = window.location.pathname === '/popup.html';
let activeTab;
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  activeTab = tabs[0];
  // chrome.history.search({ text: activeTab.url }, (history) => {
  //   console.log('history', history)
  //   activeTab.lastVisitTime = history.lastVisitTime;
  //   activeTab.visitCount = history.visitCount;
  // });
});

chrome.history.onVisited.addListener((history) => {
  // find a place for this wher has access to starmarks object and addStarmarks action
  // update starmark
});

const decorateHistory = (starmark) => {
  if (!starmark.url) return starmark;
  return chrome.history.search({ text: starmark.url }, (history) => {
    const { visitCount, lastVisitTime } = history;
    return {
      ...starmark,
      visitCount,
      lastVisitTime
    };
  });
};

// const openWindow = chrome.tabs.create.bind(null, { url: 'window.html' });
@connect(
  state => ({
    starmarks: state.starmarks
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

  componentDidMount() {
    const { starmarks, actions } = this.props;
    chrome.history.onVisited.addListener((history) => {
      if (!starmarks[history.url]) return;
      const starmark = starmarks[history.url];
      const { visitCount, lastVisitTime } = history;
      actions.addStarmark({
        ...starmark,
        visitCount,
        lastVisitTime
      });
    });
  }

  seeStars() {
    chrome.tabs.create({ url: 'window.html' });
  }

  render() {
    const { starmarks, actions } = this.props;
    const starmark = starmarks[activeTab.url] || activeTab;
    return (
      <div className={style.container}>
        {/* <Header addTodo={actions.addTodo} /> */}
        {/* <MainSection todos={todos} actions={actions} /> */}
        { !isPopup && <StarList starmarks={starmarks} addStarmark={actions.addStarmark} /> }
        <div className={style.popup}>
          <Starmark
            starmark={{ title: starmark.title, rating: starmark.rating, url: activeTab.url }}
            addStarmark={actions.addStarmark}
          />
          { isPopup && <button onClick={this.seeStars}>Explore Starmarks</button>}
        </div>
      </div>
    );
  }
}
