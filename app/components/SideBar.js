import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Editor from './Editor';
import { searchFilters, getFilter } from '../utils/searchResults';
import * as TodoActions from '../actions/todos';
import style from './SideBar.css';

@connect(
  state => ({
    search: state.search,
    starmarks: state.starmarks
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class SideBar extends Component {

  static propTypes = {
    updateSearch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    foundCount: PropTypes.number.isRequired
  };

  render() {
    const { selection, actions } = this.props;
    const starmark = selection[0];
    return (
      <div className={style.fixedContainer}>
          { starmark &&
              <div className={style.popup}>
                <Editor starmark={starmark} actions={actions} />
              </div>
          }
      </div>
    );
  }
}
