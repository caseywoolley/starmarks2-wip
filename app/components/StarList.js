import React, { PropTypes, Component } from 'react';
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import Starmark from './Starmark';
import style from './StarList.css';

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
        {_.map(displayStarmarks, (starmark, i) => (
          <div className={classnames({ [style.oddRow]: i % 2 })}>
          <Starmark  key={starmark.url} starmark={starmark} />
          </div>
        ))}
        <Waypoint onEnter={this.loadMore.bind(this)} />
      </div>
    );
  }
}
