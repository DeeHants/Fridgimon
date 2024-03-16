function FridgimonEB() {
    // Page state
    const [isBusy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [scannerResult, setScannerResult] = React.useState(null);

    const [items, setItems] = React.useState([]);

    // Handle scan events
    function lookupItem(scan_data, _scan_source, _scan_type) {
        api_lookup(
            {
                code: scan_data,
            },
            function (data, _error) {
                if (!data) {
                    setError("Unable to lookup " + scan_data);
                    data = {
                        code: scan_data,
                    }
                }

                // Update the scan results
                setScannerResult(data);
                refreshItems({ code: data.code });
            }
        );
    }

    // Contents
    React.useEffect(() => {
        refreshItems();
    }, []);

    function refreshItems(filter) {
        setBusy(true);

        api_contents(
            filter,
            function (data, _error) {
                if (!data) {
                    setError("Unable to get contents");
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

            <h1>Fridgimon</h1>
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
                        refreshItems();
                    }}
                    onRefresh={(new_item) => {
                        if (new_item) {
                            setScannerResult(new_item);
                        }
                        refreshItems({ code: scannerResult.code })
                    }}
                />}

            {items.map(item => (
                <LineItem
                    key={item.content_id}
                    item={item}
                    actions={[
                        {
                            caption: "Remove",
                            disabled: true,
                        },
                    ]}
                />
            ))}
        </>
    );
}
