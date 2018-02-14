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
});

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
    // const { starmarks, actions } = this.props;
    // chrome.history.onVisited.addListener((history) => {
    //   console.log(history)
    //   if (!starmarks[history.url]) return;
    //   const starmark = starmarks[history.url];
    //   const { visitCount, lastVisitTime } = history;
    //   actions.addStarmark({
    //     ...starmark,
    //     visitCount,
    //     lastVisitTime
    //   });
    // });
  }

  seeStars = () => {
    chrome.tabs.create({ url: 'window.html' });
  }

  render() {
    const { starmarks, actions } = this.props;
    const starmark = starmarks[activeTab.url] || activeTab;
    return (
      <div className={style.container}>
        { !isPopup && <StarList starmarks={starmarks} actions={actions} /> }
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
