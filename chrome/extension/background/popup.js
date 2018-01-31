chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    code: 'document.getElementById("starmarks-secret-button").click()'
  });
});
