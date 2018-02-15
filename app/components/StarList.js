import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import _forEach from 'lodash/forEach';
import _uniqueId from 'lodash/uniqueId';
import style from './StarList.css';
import timeSince from '../utils/timeSince';
import Starmark from '../components/Starmark';

// const toArrayWithKeys = obj => _map(obj, (value, key) => ({ key, ...value }));
// const getArrayOfKeys = obj => _reduce(obj, (value, key) => key, []);
// const getHistory = (starmark) => {
//   return chrome.history.search({ text: starmark.url }, (data) => {
//     return data[0];
//   });
// };

class StarItem extends Component {

  static propTypes = {
    starmark: PropTypes.object.isRequired,
    // actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      history: {}
    };
  }

  render() {
    const { starmark } = this.props;
    return (
      <div>
        <span>{starmark.title}</span>
        <span><a href={starmark.url} rel="noopener noreferrer" target="_blank">{starmark.url}</a></span>
        <span>{timeSince(starmark.lastVisitTime) || 'Never'}</span>
        <span>{starmark.visitCount || 0}</span>
        <span className={style.starmark}>
          <Starmark starmark={starmark} />
        </span>
      </div>
    );
  }

}

// const starItems = ({ starmarks, actions }, { displayLimit, history }) => {
//   // const visibleStarmarks = toArrayWithKeys(starmarks).slice(0, displayLimit);
//   const displayMap = Object.keys(starmarks).slice(0, displayLimit);
//   return _map(displayMap, (url) => {
//     return (
//       <StarItem key={_uniqueId()} starmark={starmarks[url]} actions={actions} />
//     );
//   });
// };

export default class StarList extends Component {

  static propTypes = {
    // addStarmark: PropTypes.func.isRequired,
    starmarks: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      displayLimit: 0,
      history: {}
    };
  }

  updateHistory = (newHistory) => {
    this.setState({
      history: newHistory
    });
  }

  loadMore = () => {
    this.setState({
      displayLimit: this.state.displayLimit + 5
    });
  }

  render() {
    const { starmarks } = this.props;
    const { displayLimit } = this.state;
    const displayMap = Object.keys(starmarks).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        {_map(displayMap, (url) => (
          <StarItem key={_uniqueId()} starmark={starmarks[url]} />
        ))}
        <Waypoint onEnter={this.loadMore.bind(this)} />
      </div>
    );
  }
}
