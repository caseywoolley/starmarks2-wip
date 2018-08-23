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
    starmarks: state.starmarks,
    tags: state.tags,
    selection: state.ui.selection
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class SideBar extends Component {

  static propTypes = {
    // updateSearch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    // foundCount: PropTypes.number.isRequired
  };

  render() {
    const { selection, actions, starmarks, tags } = this.props;
    const starmark = selection.length ? starmarks[selection[0].url] : null;
    if (starmark) {
      console.log(starmark.rating)
    }

    return (
      <div className={style.fixedContainer}>
        <div className={style.content}>
          { starmark &&
            <div className={style.popup}>
              <Editor starmark={starmark} actions={actions} />
            </div>
          }
          <ul className={style.tagsContainer}>
            {_.map(tags, tag => (
              <li onClick={() => actions.addFilter({ tags: tag.title })} className={style.tag} key={tag.id}>{tag.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
