// Brain Dump Inbox — background.js
// A minimal service worker to handle side panel interactions in Chrome and Vivaldi.

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Error setting side panel behavior:", error));
