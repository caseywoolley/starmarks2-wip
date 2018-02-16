import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import { initializeState } from '../../app/utils/bookmarkStorage';

const renderApp = (state) => {
  // TODO: fix race condition with initializeState
  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root store={createStore(state)} />,
    document.querySelector('#root')
  );
};



initializeState(renderApp);
