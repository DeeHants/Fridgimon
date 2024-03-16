"use strict";

function Reader(_ref) {
  var onError = _ref.onError,
    onScan = _ref.onScan;
  // Enable and disable the scanner as this component is loaded
  React.useEffect(function () {
    // Initialise the barcode scanner
    EB.Barcode.enable({
      allDecoders: true
    }, scanReceived);

    // Prepare the barcode scanner cleanup
    return function () {
      EB.Barcode.disable();
    };
  }, []);

  // Handle scan events
  function scanReceived(params) {
    if (params['data'] == "") {
      onError("Scan failed");
      return;
    }
    var scan_data = params['data'];
    var scan_source = params['source'];
    var scan_type = params['type'];
    onScan(scan_data, scan_source, scan_type);
  }

  // No visible component
  return null;
}