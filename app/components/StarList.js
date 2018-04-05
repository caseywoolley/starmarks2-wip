import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import Starmark from './Starmark';
import style from './StarList.css';
import starmarkStyle from './Starmark.css';

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
    // console.log(filterStarmarks(this.props.starmarks, this.state.search).length)
    if (this.state.displayLimit < this.props.results.length) {
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

  updateSort = (newSort) => {
    const { search } = this.props;
    const { updateSearch } = this.props.actions;

    const update = { ...newSort };
    update.reverse = !search.reverse;
    if (update.sortBy !== search.sortBy) {
      update.reverse = true;
    }
    updateSearch(update);
  }

  render() {
    const { tags, results } = this.props;
    const { displayLimit } = this.state;
    // const results = filterStarmarks(starmarks, search).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        <div className={[starmarkStyle.row, style.heading].join(' ')}>
          <span className={starmarkStyle.favicon} />
          <span className={starmarkStyle.title} onClick={() => this.updateSort({ sortBy: 'title' })}>Title</span>
          <span className={starmarkStyle.rating} onClick={() => this.updateSort({ sortBy: 'rating' })}>Rating</span>
          <span className={starmarkStyle.date} onClick={() => this.updateSort({ sortBy: 'dateAdded' })}>Added</span>
          <span className={starmarkStyle.date} onClick={() => this.updateSort({ sortBy: 'lastVisitTime' })}>Visited</span>
          <span className={starmarkStyle.visitCount} onClick={() => this.updateSort({ sortBy: 'visitCount' })}>Visits</span>
        </div>
        <div className={style.list}>
          {_.map(results.slice(0, displayLimit), (starmark, i) => (
            <div key={starmark.url} className={classnames({ [style.oddRow]: !(i % 2) })}>
              <Starmark starmark={starmark} tags={tags} updateSearch={this.updateSearch} />
            </div>
          ))}
          <Waypoint key={displayLimit} onEnter={this.loadMore} />
        </div>
      </div>
    );
  }
}
