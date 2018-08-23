import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TableDragSelect from "react-table-drag-select";
import Waypoint from 'react-waypoint';
import classnames from 'classnames';
import _ from 'lodash';

import * as TodoActions from '../actions/todos';
import './StarList.css';

import searchResults from '../utils/searchResults';


import Starmark from './Starmark';
import style from './StarList.css';
import starmarkStyle from './Starmark.css';
const LIMIT = 30;
const parseUrl = url => new URL(url);
const getCellsArray = num => _.times(num, () => { return [false] });
const getSelected = (results, cells) => _.filter(results, (result, i) => cells[i] && cells[i][0]);
const resultsHaveChanged = (results, newResults) => _.get(results[0], 'title') !== _.get(newResults[0], 'title') || results.length !== newResults.length;

let isMouseDown;

@connect(
  state => ({
    starmarks: state.starmarks,
    tags: state.tags,
    search: state.search
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
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
      selected: [],
      canSelect: true
    };
  }

  componentWillUpdate(nextProps) {
    const { results, setSelection } = this.props;
    if (resultsHaveChanged(results, nextProps.results)) {
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
    if (this.state.canSelect) {
      const { results, setSelection } = this.props;
      const selected = getSelected(results, cells);
      setSelection(selected);
      console.log(selected)
      this.setState({ cells, selected });
    }
  }

  handleMouseOver = (e) => {
    if (!isMouseDown) {
      this.setState({
        canSelect: !(e.target.title || e.target.href)
      });
    }
  }

  render() {
    const { tags, actions, setSelection, starmarks, search } = this.props;
    const { displayLimit, cells } = this.state;
    const results = searchResults(starmarks, tags, search);
    const limitedResults = results.slice(0, displayLimit);
    return (
      <div className={style.starlist}>
        <TableDragSelect
          className={classnames({ [style.selectableTable]: true, [style.selectable]: this.state.canSelect })}
          value={this.state.cells}
          onChange={this.updateSelection}
          onMouseOver={this.handleMouseOver}
          onMouseDown={() => (isMouseDown = true)}
          onMouseUp={() => (isMouseDown = false)}
        >
          {_.map(limitedResults, (starmark, i) => (
            <tr key={starmark.url + starmark.rating}>
              <td className={classnames({ [style.oddRow]: !(i % 2), [style.row]: true })}>
                <Starmark starmark={starmark} tags={tags} actions={actions} />
              </td>
            </tr>
          ))}
        </TableDragSelect>
        <Waypoint key={displayLimit} onEnter={() => this.loadMore()} />
      </div>
    );
  }
}
