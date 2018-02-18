import React, { PropTypes, Component } from 'react';

import StarSelector from './StarSelector';
import timeSince from '../utils/timeSince';
import getFavicon from '../utils/getFavicon';
import style from './Starmark.css';

const NewTabLink = (props) => (
  <a href={props.url} rel="noopener noreferrer" target="_blank">{props.children}</a>
);

export default class StarItem extends Component {

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
      <div className={style.starmark}>
        <span className={style.favicon}><img alt="" src={getFavicon(starmark.url)} /></span>
        <span className={style.title}>
          <NewTabLink url={starmark.url}>{starmark.title}</NewTabLink>
        </span>
        <span className={style.url}>
          <NewTabLink url={starmark.url}>{starmark.url}</NewTabLink>
        </span>
        <span className={style.stars}>
          <StarSelector starmark={starmark} />
        </span>
        <span className={style.date}>{timeSince(starmark.dateAdded)}</span>
        <span className={style.date}>{timeSince(starmark.lastVisitTime)}</span>
        <span className={style.visitCount}>{starmark.visitCount || 0}</span>
      </div>
    );
  }
}
