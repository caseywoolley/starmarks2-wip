import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import { initializeState } from '../../app/utils/bookmarkStorage';

const renderApp = (state) => {
  const initialState = state || {};
  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
};

initializeState(renderApp);
