import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TodoActions from '../actions/todos';

import StarmarkTextInput from '../components/StarmarkTextInput';
import StarSelector from '../components/StarSelector';
import StarList from '../components/StarList';
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

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false
    };
  }

  componentDidMount() {
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
    const { starmarks, actions } = this.props;
    const { isEditing } = this.state;
    const starmark = starmarks[activeTab.url] || activeTab;
    return (
      <div className={style.container}>
        { !isPopup && <StarList starmarks={starmarks} actions={actions} /> }
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
