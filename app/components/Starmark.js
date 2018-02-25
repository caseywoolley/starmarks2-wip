import React, { PropTypes, Component } from 'react';

import StarSelector from './StarSelector';
import timeSince from '../utils/timeSince';
import getFavicon from '../utils/getFavicon';
import style from './Starmark.css';

const NewTabLink = (props) => (
  <a href={props.url} rel="noopener noreferrer" target="_blank">{props.children}</a>
);

export default class Starmark extends Component {

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
    const { starmark, updateSearch } = this.props;
    return (
      <div className={style.starmark}>
        <div className={style.row}>
          <span className={style.favicon}><img alt="" src={getFavicon(starmark.url)} /></span>
          <span className={style.title}>
            <div>
              <NewTabLink url={starmark.url}><span title={starmark.title}>{starmark.title}</span></NewTabLink>
              <span className={style.url}>
                <NewTabLink url={starmark.url}><span title={starmark.url}>{starmark.url}</span></NewTabLink>
              </span>
            </div>
            <div className={style.tagRow}>
              { starmark.tags.map(tag => <span onClick={() => updateSearch(tag)} className={style.tag} key={tag.id}>{tag.title}</span>) }
            </div>
          </span>
          <span className={style.stars}>
            <StarSelector starmark={starmark} />
          </span>
          <span className={style.date}>{timeSince(starmark.dateAdded)}</span>
          <span className={style.date}>{timeSince(starmark.lastVisitTime)}</span>
          <span className={style.visitCount}>{starmark.visitCount || 0}</span>
        </div>
      </div>
    );
  }
}
