import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import { initializeState } from '../../app/utils/bookmarkStorage';
import createStore from '../../app/store/configureStore';

const renderApp = (state) => {
  ReactDOM.render(
    <Root store={createStore(state)} />,
    document.querySelector('#root')
  );
};

initializeState(renderApp);
