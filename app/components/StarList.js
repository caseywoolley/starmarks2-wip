import React, { PropTypes, Component } from 'react';
import _map from 'lodash/map';
import _uniqueId from 'lodash/uniqueId';
import style from './StarList.css';
import timeSince from '../utils/timeSince';
import Starmark from '../components/Starmark';

export default class StarList extends Component {

  static propTypes = {
    addStarmark: PropTypes.func.isRequired,
    starmarks: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addStarmark } = this.props;
    return (
      <div className={style.starlist}>
        { _map(this.props.starmarks, (starmark, url) => (
          <div key={_uniqueId()}>
            <span>{starmark.title}</span>
            <span><a href={url} rel="noopener noreferrer" target="_blank">{url}</a></span>
            <span>{timeSince(starmark.lastVisitTime)}</span>
            <span>{starmark.visitCount}</span>
            <span className={style.starmark}>
              <Starmark starmark={{ ...starmark, url }} addStarmark={addStarmark} />
            </span>
          </div>
        )
      ) }
      </div>
    );
  }
}
