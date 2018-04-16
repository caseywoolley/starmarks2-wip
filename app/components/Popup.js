import React, { Component, PropTypes } from 'react';
import StarSelector from './StarSelector';
import StarmarkTextInput from './StarmarkTextInput';
import style from './Modal.css';

export default class Popup extends Component {

  static propTypes = {
    starmark: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false
    };
  }

  render() {
    // const { starmark, actions } = this.props;
    // return (
    //   <div className={style.popup}>
    //     <div className={style.stars}>
    //       <StarSelector
    //         starmark={{ title: starmark.title, rating: starmark.rating, url: starmark.url }}
    //         addStarmark={actions.addStarmark}
    //       />
    //     </div>
    //     { !this.state.isEditing
    //         ? <div onDoubleClick={() => this.setState({ isEditing: true })}>{starmark.title}</div>
    //         : <StarmarkTextInput text={starmark.title} onSave={this.onSave} />
    //     }
    //     <div>{starmark.url}</div>
    //     <button onClick={this.seeStars}>Explore Starmarks</button>
    //   </div>
    // );
  }
}
