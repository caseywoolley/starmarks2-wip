import React, { PropTypes, Component } from 'react';
import Starmark from '../components/Starmark';

import style from './StarList.css';
import _map from 'lodash/map';
import _uniqueId from 'lodash/uniqueId';


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
    const { starmarks, addStarmark } = this.props;
    return (
      <div className={style.starlist}>
        { _map(starmarks, (starmark, url) => (
          <div key={_uniqueId()}>
            <span>{starmark.title}</span>
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
