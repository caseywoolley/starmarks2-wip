import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import App from './App';
// import { backgroundStateRefresh } from '../../chrome/extension/background';
import { stateRefresh } from '../../app/utils/bookmarkStorage';

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    stateRefresh(store);
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
