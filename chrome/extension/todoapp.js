import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';
import { getState } from '../../app/utils/bookmarkStorage';
import createStore from '../../app/store/configureStore';
import { backgroundStateRefresh } from '../../app/utils/bookmarksToStarmarks';


const renderApp = (state) => {
  const store = createStore(state);
  backgroundStateRefresh(store);
  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
};

getState(renderApp);
