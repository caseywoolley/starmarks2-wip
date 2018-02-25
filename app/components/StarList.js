import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import Starmark from './Starmark';
import style from './StarList.css';

const searchFilter = (search, starmark) => {
  return _.find(starmark.tags, { title: search });
};

export default class StarList extends Component {

  static propTypes = {
    // addStarmark: PropTypes.func.isRequired,
    starmarks: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      displayLimit: 30,
      search: ''
    };

    console.log('url', chrome.runtime.getURL(''));
  }

  loadMore = () => {
    this.setState({
      displayLimit: this.state.displayLimit + 30
    });
  }

  updateSearch = (update) => {
    console.log(update)
    this.setState({
      search: update.title,
      displayLimit: 30
    });
  }

  render() {
    const { starmarks } = this.props;
    const { displayLimit, search } = this.state;
    const displayStarmarks = _.sortBy(_.toArray(starmarks), 'dateAdded').reverse().filter((starmark) => {
      return _.find(starmark.tags, tag => tag.title.includes(search));
    }).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        {_.map(displayStarmarks, (starmark, i) => (
          <div key={starmark.url} className={classnames({ [style.oddRow]: i % 2 })}>
            <Starmark starmark={starmark} updateSearch={this.updateSearch} />
          </div>
        ))}
        <Waypoint key={displayLimit} onEnter={this.loadMore} />
      </div>
    );
  }
}
