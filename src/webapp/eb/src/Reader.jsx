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

        var scan_data = params['data'];
        var scan_source = params['source'];
        var scan_type = params['type'];

        onScan(scan_data, scan_source, scan_type);
    }

    // No visible component
    return null;
}
