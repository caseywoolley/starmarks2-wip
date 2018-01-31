import React, { Component } from 'react';
import { render } from 'react-dom';
import Modal from '../../app/components/Modal';
import style from '../../app/components/Modal.css';

class InjectApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      widgetId: 'default',
      isVisible: false
    };
  }

  componentDidMount() {
    // pass in existing bookmark rating here
    // this.handleChange({target:{value:'4'}})
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  handleChange = (e) => {
    this.setState({
      rating: e.target.value
    });
  }

  render() {
    const id = this.state.widgetId;
    const ratingInput = i => <input type="radio" checked={this.state.rating === i.toString()} onChange={this.handleChange} id={`star${i}-${id}`} name={`rating-${id}`} value={i} />;
    const ratingLabel = i => <label className="full star" id={i} htmlFor={`star${i}-${id}`}title={`${i} stars`} />;
    return (
      <div>
        <div className={style.actionButtons}>
          <button onClick={this.buttonOnClick} id="starmarks-secret-button">click me</button>
        </div>
        { this.state.isVisible &&
          <Modal>
            <div className={style.rating} name={`rating-${id}`} id={`rating-${id}`}>
              {ratingInput(5)}{ratingLabel(5)}
              {ratingInput(4)}{ratingLabel(4)}
              {ratingInput(3)}{ratingLabel(3)}
              {ratingInput(2)}{ratingLabel(2)}
              {ratingInput(1)}{ratingLabel(1)}
            </div>
            {/* { this.state.rating } */}
          </Modal>
        }
      </div>
    );
  }
}

const injectDOM = document.createElement('div');
injectDOM.className = 'strmks-ext-container';
injectDOM.id = style.pkt_ext_master;
document.body.appendChild(injectDOM);
render(<InjectApp />, injectDOM);
