import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import _map from 'lodash/map';
import _uniqueId from 'lodash/uniqueId';
import style from './StarList.css';
import timeSince from '../utils/timeSince';
import Starmark from '../components/Starmark';

const toArrayWithKeys = obj => _map(obj, (value, key) => ({ key, ...value }));

const starItems = ({ starmarks, addStarmark }, { displayLimit }) => (
  _map(toArrayWithKeys(starmarks).slice(0, displayLimit), starmark => (
    <div key={_uniqueId()}>
      <span>{starmark.title}</span>
      <span><a href={starmark.url} rel="noopener noreferrer" target="_blank">{starmark.url}</a></span>
      <span>{timeSince(starmark.lastVisitTime)}</span>
      <span>{starmark.visitCount}</span>
      <span className={style.starmark}>
        <Starmark starmark={starmark} addStarmark={addStarmark} />
      </span>
    </div>
    )
  )
);

export default class StarList extends Component {

  static propTypes = {
    addStarmark: PropTypes.func.isRequired,
    starmarks: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      displayStart: 0,
      displayLimit: 10
    };
  }

  loadMore = () => {
    this.setState({
      displayLimit: this.state.displayLimit + 10
    });
  }

  render() {
    return (
      <div className={style.starlist}>
        {starItems(this.props, this.state)}
        <Waypoint onEnter={this.loadMore} />
      </div>
    );
  }
}
