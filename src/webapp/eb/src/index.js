// Document handling
window.addEventListener('DOMContentLoaded', loadEvent);
window.addEventListener('unload', unloadEvent);

function loadEvent() {
    initScanner();
    initReactApp();
}

function unloadEvent() {
    uninitScanner();
}

// Scanner handling
function initScanner() {
    EB.Barcode.enable({
        allDecoders: true,
    }, scanReceived);
}

function uninitScanner() {
    EB.Barcode.disable();
}

function scanReceived(params) {
    if (params['data'] == "") {
        updateReactApp({
            reader_error: "Scan failed",
        });
        return;
    }

    var scan_upc = params['data'];
    var scan_source = params['source'];
    var scan_type = params['type'];

    EB.jQuery.ajax({
        url: "/api/lookup?code=" + params['data'],
        async: true,
        dataType: 'json',
        success: function (data, status, jqXHR) {
            var lookup_upc = data['upc'];
            if (!data['found']) {
                updateReactApp({
                    reader_error: "No result for " + lookup_upc,
                    result: data,
                });
            } else {
                var lookup_name = data['name'];
                updateReactApp({
                    result: data,
                });
            }
        },
        error: function (jqXHR, errorText, errorThrown) {
            updateReactApp({
                reader_error: "Unable to lookup " + scan_upc,
                result: {
                    upc: scan_upc,
                }
            });
        },
    });
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

function updateReactApp(state) {
    appElement = React.createElement(FridgimonEB, state);
    appRoot.render(appElement);
}
