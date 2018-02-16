import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import _ from 'lodash';
import style from './StarList.css';
import timeSince from '../utils/timeSince';
import Starmark from '../components/Starmark';

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
        <span>{timeSince(starmark.lastVisitTime)}</span>
        <span>{timeSince(starmark.dateAdded)}</span>
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
      displayLimit: 30
    };
  }

  loadMore = () => {
    this.setState({
      displayLimit: this.state.displayLimit + 30
    });
  }

  render() {
    const { starmarks } = this.props;
    const { displayLimit } = this.state;
    const displayStarmarks = _.sortBy(_.toArray(starmarks), 'dateAdded').reverse().slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        {_.map(displayStarmarks, starmark => (
          <StarItem key={_.uniqueId()} starmark={starmark} />
        ))}
        <Waypoint onEnter={this.loadMore.bind(this)} />
      </div>
    );
  }
}
