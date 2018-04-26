import React from 'react';
import ReactDOM from 'react-dom';
import { Store } from 'react-chrome-redux';

import Root from '../../app/containers/Root';
import './todoapp.css';
import { stateRefresh } from '../../app/utils/bookmarkStorage';

import createStore from '../../app/store/configureStore';

const store = new Store({
  portName: 'STARMARKS' // communication port name
});

store.ready().then(() => {
  // const renderApp = (state) => {
  stateRefresh(store);
  ReactDOM.render(
    <Root store={store} />,
    // <Root store={createStore(state)} />,
    document.querySelector('#root')
  );
  // };
});

// getState(renderApp);
