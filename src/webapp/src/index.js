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
    appContainer = document.getElementById('fridgimon');
    appRoot = ReactDOM.createRoot(appContainer);
    appElement = React.createElement(Fridgimon, {
        eb: appContainer.getAttribute("eb") === "true",
    });
    appRoot.render(appElement);
}
