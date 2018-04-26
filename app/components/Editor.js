import React, { Component, PropTypes } from 'react';
import StarSelector from './StarSelector';
import StarmarkTextInput from './StarmarkTextInput';
import style from './Editor.css';
import getFavicon from '../utils/getFavicon';

export default class Editor extends Component {

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

  onSave = (title, starmark) => {
    this.props.actions.addStarmark({
      title,
      rating: starmark.rating,
      url: starmark.url
    });
    this.setState({ isEditing: false });
  }

  render() {
    const { starmark, actions } = this.props;
    return (
      <div className={style.popup}>
        <div className={style.stars}>
          <StarSelector
            starmark={starmark}
            addStarmark={actions.addStarmark}
          />
        </div>
        { !this.state.isEditing
            ? <div className={style.title} onDoubleClick={() => this.setState({ isEditing: true })}>{starmark.title}</div>
            : <StarmarkTextInput text={starmark.title} onSave={title => this.onSave(title, starmark)} />
        }
        <div className={style.urlBlock}>
          <span className={style.favicon}><img alt="" src={getFavicon(starmark.url)} /></span>
          <span className={style.url}>{starmark.url}</span>
        </div>
        {/* <button onClick={this.seeStars}>Explore Starmarks</button> */}
      </div>
    );
  }
}
