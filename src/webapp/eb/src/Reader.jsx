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

        EB.jQuery.ajax({
            url: "/api/lookup?code=" + params['data'],
            async: true,
            dataType: 'json',
            success: function (data, status, jqXHR) {
                var lookup_upc = data['upc'];
                if (!data['found']) {
                    onError("No result for " + lookup_upc);
                }
                onScan(data);
            },
            error: function (jqXHR, errorText, errorThrown) {
                onError("Unable to lookup " + scan_upc);
                onScan({
                    upc: scan_upc,
                });
            }
        });
    }

    // No visible component
    return null;
}
