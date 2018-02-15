import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import { initializeState } from '../../app/utils/bookmarkStorage';
import getStore from './background';

const renderApp = (state) => {
  // const initialState = state || {};
  // const createStore = require('../../app/store/configureStore');
debugger
  ReactDOM.render(
    // <Root store={createStore(initialState)} />,
    <Root store={getStore()} />,
    document.querySelector('#root')
  );
};

initializeState(renderApp);
