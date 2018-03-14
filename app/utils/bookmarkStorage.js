
export const encodeState = state => encodeURIComponent(JSON.stringify(state));
export const decodeState = state => JSON.parse(decodeURIComponent(state || '{}'));

export const saveState = (state) => {
  chrome.storage.local.set({ state: encodeState(state) });
};

export const getState = (callback) => {
  chrome.storage.local.get('state', data => callback(decodeState(data.state)));
};

export default getState;
