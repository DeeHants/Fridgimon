"use strict";

// Document handling
window.addEventListener('DOMContentLoaded', loadEvent);
function loadEvent() {
  initReactApp();
}

// React app/components
var appContainer;
var appRoot;
var appElement;
function initReactApp() {
  appContainer = document.getElementById('app');
  appRoot = ReactDOM.createRoot(appContainer);
  appElement = React.createElement(FridgimonEB, {});
  appRoot.render(appElement);
}