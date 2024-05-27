function FridgimonEB() {
    // Page state
    const [isBusy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [scannerResult, setScannerResult] = React.useState(null);

    const [items, setItems] = React.useState([]);

    // Handle scan events
    function lookupItem(scan_data, scan_source, _scan_type) {
        var code_type_parts = scan_source.split(":", 2);
        var code_type = code_type_parts[1];
        api_lookup_item(
            {
                code: scan_data,
                type: code_type,
            },
            function (data, error) {
                if (!data) {
                    setError("Unable to lookup " + scan_data + ", " + error);
                    data = {
                        code: scan_data,
                    }
                }

                // Update the scan results
                setScannerResult(data);
            }
        );
    }

    // Contents
    React.useEffect(() => {
        refreshItems();
    }, [scannerResult]);

    function refreshItems() {
        setBusy(true);

        // Filter on the current scanned item
        var filter = {};
        if (scannerResult) {
            filter.code = scannerResult.code;
        }

        api_get_contents(
            filter,
            function (data, error) {
                if (!data) {
                    setError("Unable to get contents, " + error);
                    data = []
                }
                setItems(data);
                setBusy(false);
            }
        );
    }

    return (
        <>
            <Busy isBusy={isBusy} />
            {/* Invisible component to manage the reader */}
            <Reader
                setError={setError}
                onScan={lookupItem}
            />

            <Header />
            <ReaderStatus
                error={error}
                onDismiss={() => {
                    setError("");
                }}
            />

            {scannerResult &&
                <ScannedItem
                    key={scannerResult.code}
                    item={scannerResult}
                    onClear={() => {
                        setScannerResult();
                    }}
                    onRefresh={(new_item) => {
                        if (new_item) {
                            setScannerResult(new_item);
                        }
                        refreshItems();
                    }}
                />}

            {items.map(item => (
                <ExistingItem
                    key={item.content_id}
                    item={item}
                    onRefresh={refreshItems}
                />
            ))}
        </>
    );
}
