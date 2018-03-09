import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import Starmark from './Starmark';
import style from './StarList.css';

const searchFilter = (search, starmark) => {
  return _.find(starmark.tags, { title: search });
};

const displayStarmarks = (starmarks, search) => {
  return _.sortBy(_.toArray(starmarks), 'dateAdded').reverse(); //.filter((starmark) => {
  //   return true //_.find(starmark.tags, tag => tag.title.includes(search));
  // });
}

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
  }

  loadMore = () => {
    console.log(displayStarmarks(this.props.starmarks, this.state.search).length)
    if (this.state.displayLimit < displayStarmarks(this.props.starmarks, this.state.search).length) {
      this.setState({
        displayLimit: this.state.displayLimit + 30
      });
    }
  }

  updateSearch = (update) => {
    console.log(update)
    this.setState({
      search: update.title,
      displayLimit: 30
    });
  }

  render() {
    const { starmarks, tags } = this.props;
    const { displayLimit, search } = this.state;
    const starmarksArray = displayStarmarks(starmarks, search).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        {_.map(starmarksArray, (starmark, i) => (
          <div key={starmark.url} className={classnames({ [style.oddRow]: i % 2 })}>
            <Starmark starmark={starmark} tags={tags} updateSearch={this.updateSearch} />
          </div>
        ))}
        <Waypoint key={displayLimit} onEnter={this.loadMore} />
      </div>
    );
  }
}
