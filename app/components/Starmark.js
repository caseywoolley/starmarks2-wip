import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import StarInput from './StarInput';
import style from './TodoItem.css';

export default class Starmark extends Component {

  static propTypes = {
    starmark: PropTypes.object.isRequired,
    editStarmark: PropTypes.func.isRequired,
    deleteStarmark: PropTypes.func.isRequired,
    updateStarmark: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleSave = (text) => {
    const { starmark, deleteStarmark, editStarmark } = this.props;
    if (text.length === 0) {
      deleteStarmark(starmark.id);
    } else {
      editStarmark(starmark.id, text);
    }
    this.setState({ editing: false });
  };

  handleUpdate = () => {
    const { starmark, updateStarmark } = this.props;
    updateStarmark(starmark.id);
  };

  handleDelete = () => {
    const { starmark, deleteStarmark } = this.props;
    deleteStarmark(starmark.id);
  };

  render() {
    const { starmark } = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput
          text={starmark.text}
          editing={this.state.editing}
          onSave={this.handleSave}
        />
      );
    } else {
      element = (
        <div className={style.view}>
          <input
            className={style.toggle}
            type="checkbox"
            checked={starmark.completed}
            onChange={this.handleComplete}
          />
          <label onDoubleClick={this.handleDoubleClick}>
            {starmark.text}
          </label>
          <button
            className={style.destroy}
            onClick={this.handleDelete}
          />
        </div>
      );
    }

    return (
      <li
        className={classnames({
          [style.completed]: starmark.completed,
          [style.editing]: this.state.editing,
          [style.normal]: !this.state.editing
        })}
      >
        {element}
      </li>
    );
  }
}
