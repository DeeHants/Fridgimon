function Reader({ onError, onScan }) {
    // Enable and disable the scanner as this component is loaded
    React.useEffect(() => {
        // Initialise the barcode scanner
        EB.Barcode.enable({
            allDecoders: true,
        }, scanReceived);

        // Prepare the barcode scanner cleanup
        return () => {
            EB.Barcode.disable();
        };
    }, []);

    // Handle scan events
    function scanReceived(params) {
        if (params['data'] == "") {
            onError("Scan failed");
            return;
        }

        var scan_upc = params['data'];
        var scan_source = params['source'];
        var scan_type = params['type'];

        api_lookup({
            code: params['data'],
        }, function (data, _error) {
            if (!data) {
                onError("Unable to lookup " + scan_upc);
                data = {
                    upc: scan_upc,
                }
            } else if (!data['found']) {
                var lookup_upc = data['upc'];
                onError("No result for " + lookup_upc);
            }

            // Return the scan results
            onScan(data);
        });
    }

    // No visible component
    return null;
}
