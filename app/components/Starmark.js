import _uniqueId from 'lodash/uniqueId';
import React, { PropTypes, Component } from 'react';
import style from './Starmark.css';

export default class Starmark extends Component {

  static propTypes = {
    addStarmark: PropTypes.func.isRequired,
    starmark: PropTypes.object.isRequired,
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
    const rating = e.target.value;
    this.setState({ rating });
    this.props.addStarmark({
      ...this.props.starmark,
      rating
    });
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
