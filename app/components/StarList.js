import React, { PropTypes, Component } from 'react';
import TableDragSelect from "react-table-drag-select";
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import './StarList.css';

import Starmark from './Starmark';
import style from './StarList.css';
import starmarkStyle from './Starmark.css';
const LIMIT = 30;
const parseUrl = url => new URL(url);
const getCellsArray = num => _.times(num, () => { return [false] })
export default class StarList extends Component {

  static propTypes = {
    // addStarmark: PropTypes.func.isRequired,
    starmarks: PropTypes.object.isRequired,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      displayLimit: LIMIT,
      cells: getCellsArray(LIMIT),
      selected: []
    };
  }

  componentWillUpdate(nextProps) {
    const { results } = this.props;
    if (nextProps.results !== results) {
      const count = Math.min(nextProps.results.length, LIMIT);
      window.scrollTo(0, 0);
      this.setState({
        displayLimit: count,
        cells: getCellsArray(count)
      });
    }
  }

  loadMore = () => {
    // console.log(filterStarmarks(this.props.starmarks, this.state.search).length)
    if (this.state.displayLimit < this.props.results.length) {
      this.setState({
        displayLimit: this.state.displayLimit + LIMIT,
        cells: [...this.state.cells, ...getCellsArray(LIMIT)]
      });
    }
  }

  // updateSearch = (update) => {
  //   console.log(update)
  //   this.setState({
  //     search: update.title,
  //     // displayLimit: 30
  //   });
  // }

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

  updateSelection = (cells) => {
    const { results } = this.props;
    const selected = _.filter(results, (result, i) => cells[i] && cells[i][0]);
    this.setState({ cells, selected });
    console.log(selected)
  }

  render() {
    const { tags, results, actions } = this.props;
    const { displayLimit, cells } = this.state;
    const limitedResults = results.slice(0, displayLimit);
    // const results = filterStarmarks(starmarks, search).slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        <div className={[starmarkStyle.row, style.heading].join(' ')}>
          <span className={starmarkStyle.favicon} onClick={() => this.updateSort({ sortBy: 'url' })}>v</span>
          <span className={starmarkStyle.title} onClick={() => this.updateSort({ sortBy: 'title' })}>Title</span>
          <span className={starmarkStyle.rating} onClick={() => this.updateSort({ sortBy: 'rating' })}>Rating</span>
          <span className={starmarkStyle.date} onClick={() => this.updateSort({ sortBy: 'dateAdded' })}>Added</span>
          <span className={starmarkStyle.date} onClick={() => this.updateSort({ sortBy: 'lastVisitTime' })}>Visited</span>
          <span className={starmarkStyle.visitCount} onClick={() => this.updateSort({ sortBy: 'visitCount' })}>Visits</span>
          <span className={starmarkStyle.favicon} />
        </div>
        <TableDragSelect
          className={style.selectableTable}
          value={this.state.cells}
          onChange={this.updateSelection}
        >
          {_.map(limitedResults, (starmark, i) => (
            <tr key={starmark.url}>
              <td  className={classnames({ [style.oddRow]: !(i % 2) })}>
                <div><Starmark starmark={starmark} tags={tags} actions={actions} /></div>
              </td>
            </tr>
          ))}
        </TableDragSelect>

        <Waypoint key={displayLimit} onEnter={() => this.loadMore()} />
      </div>
    );
  }
}
