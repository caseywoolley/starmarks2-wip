import React, { Component, PropTypes } from 'react';
import style from './StarmarkTextInput.css';

export default class StarmarkTextInput extends Component {

  static propTypes = {
    onSave: PropTypes.func.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    // editing: PropTypes.bool,
    // newTodo: PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.text || ''
    };
  }

  handleSubmit = (evt) => {
    const text = evt.target.value.trim();
    if (evt.which === 13) {
      this.props.onSave(text);
      // if (this.props.newTodo) {
        // this.setState({ text: '' });
      // }
    }
  };

  handleChange = (evt) => {
    this.setState({ text: evt.target.value });
  };

  handleFocus = (event) => {
    event.target.select();
  }

  handleBlur = (evt) => {
    // if (!this.props.newTodo) {
    this.props.onSave(evt.target.value);
    // }
  };

  render() {
    return (
      <input
        className={style.edit}
        // className={classnames({
        //   [style.edit]: this.props.editing,
        //   [style.new]: this.props.newTodo
        // })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
