import React, { Component } from 'react';
import style from './SearchBar.css';

export default class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: {},
      tags: []
    };
  }

  handleChange = (e) => {
    this.setState({
      input: {
        query: e.target.value
      }
    });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      this.setState({
        tags: [...this.state.tags, e.target.value],
        input: { query: '' }
      });
    }
  }

  handleRemoveTag = (index) => {
    this.setState({
      tags: this.state.tags.filter((item, i) => i !== index)
    });
  }

  render() {
    const { foundCount } = this.props;
    return (
      <div className={style.searchContainer}>
        <div className={style.searchBar}>
          {this.state.tags.map((tag, i) =>
            <li key={i} className={style.tags} onClick={() => this.handleRemoveTag(i)}>
              {tag}
              <span>(x)</span>
            </li>
          )}
          <input type="text" onChange={this.handleChange} onKeyDown={this.handleKeyDown} value={this.state.input.query} />
        </div>
        <div><pre className={style.pre}>{JSON.stringify(this.state.input, null, 2) }</pre></div>
        <div className={style.foundCount}>{foundCount} Found</div>
      </div>
    );
  }
}
