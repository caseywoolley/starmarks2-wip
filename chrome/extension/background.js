import * as TodoActions from '../../app/actions/todos';
import { initializeState, addVisitListener } from '../../app/utils/bookmarkStorage';

require('../../app/utils/promisifyChrome');

const createStore = require('../../app/store/configureStore');

let store;
initializeState((state) => {
  store = createStore(state);
  addVisitListener(state.starmarks, (newStarmark) => {
    chrome.runtime.sendMessage({ message: 'addStarmark', starmark: newStarmark }, (response) => {
      if (!response) {
        store.dispatch(TodoActions.addStarmark(newStarmark));
      } else if (response.message) {
        console.log(response.message);
      }
    });
  });
});


module.exports = () => store;

require('./background/contextMenus');
// require('./background/inject');
require('./background/badge');

// require('./background/popup');
// chrome.tabs.getCurrent()
//   .then((tab) => {
//     actions.addStarmark({
//       ...starmark,
//       visitCount,
//       lastVisitTime
//     });
//   });
