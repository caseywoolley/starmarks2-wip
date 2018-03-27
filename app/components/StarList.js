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

  updateFilters = (newFilters) => {
    const { filters } = this.props;
    const { addFilters } = this.props.actions;

    newFilters.reverse = !filters.reverse;
    if (newFilters.sortBy !== filters.sortBy) {
      newFilters.reverse = true;
    }
    addFilters(newFilters);
  }

  render() {
    const { starmarks, tags, filters, results } = this.props;
    const { displayLimit, search } = this.state;
    // const results = filterStarmarks(starmarks, filters).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        <div className={[starmarkStyle.row, style.heading].join(' ')}>
          <span className={starmarkStyle.favicon}></span>
          <span className={starmarkStyle.title} onClick={() => this.updateFilters({ sortBy: 'title' })}>Title</span>
          <span className={starmarkStyle.rating} onClick={() => this.updateFilters({ sortBy: 'rating' })}>Rating</span>
          <span className={starmarkStyle.date} onClick={() => this.updateFilters({ sortBy: 'dateAdded' })}>Added</span>
          <span className={starmarkStyle.date} onClick={() => this.updateFilters({ sortBy: 'lastVisitTime' })}>Visited</span>
          <span className={starmarkStyle.visitCount} onClick={() => this.updateFilters({ sortBy: 'visitCount' })}>Visits</span>
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
