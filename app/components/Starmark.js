import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _uniqueId from 'lodash/uniqueId';
import * as TodoActions from '../actions/todos';

import style from './Starmark.css';


@connect(
  state => ({ ...state }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class Starmark extends Component {

  static propTypes = {
    // addStarmark: PropTypes.func.isRequired,
    starmark: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      isVisible: false
    };
  }

  componentWillMount() {
    this.setState({ rating: this.props.starmark.rating });
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  handleChange = (e) => {
    const { actions, starmark } = this.props;
    const rating = e.target.value;
    const { url, title } = starmark;
    this.setState({ rating });
    actions.addStarmark({ url, title, rating });
  }

  render() {
    const id = _uniqueId();
    const ratingInput = i => <input type="radio" checked={this.state.rating === i.toString()} onChange={this.handleChange} id={`star${i}-${id}`} value={i} />;
    const ratingLabel = i => <label htmlFor={`star${i}-${id}`} title={`${i} stars`} />;
    return (
      <div className={style.container}>
        <div className={style.rating} name={`rating-${id}`} id={`rating-${id}`}>
          {ratingInput(5)}{ratingLabel(5)}
          {ratingInput(4)}{ratingLabel(4)}
          {ratingInput(3)}{ratingLabel(3)}
          {ratingInput(2)}{ratingLabel(2)}
          {ratingInput(1)}{ratingLabel(1)}
        </div>
      </div>
    );
  }
}
