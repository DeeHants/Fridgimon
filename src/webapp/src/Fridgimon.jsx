function Fridgimon({ eb }) {
    // Page state
    const [isBusy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [scannerResult, setScannerResult] = React.useState(null);
    const [filter, setFilter] = React.useState({});

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
        var newFilter = {}
        if (scannerResult) {
            newFilter.code = scannerResult.code;
        }
        setFilter(newFilter);
    }, [scannerResult]);

    React.useEffect(() => {
        refreshItems();
    }, [filter]);

    function refreshItems() {
        setBusy(true);

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
            {/* Invisible components for external interfaces */}
            <Busy isBusy={isBusy} />
            {eb && (<Reader
                setError={setError}
                onScan={lookupItem}
            />)}

            <Header />
            <ReaderStatus
                error={error}
                onDismiss={() => {
                    setError("");
                }}
            />

            {(scannerResult || filter.code || filter.category) && (
                <div>
                    <button onClick={() => {
                        setScannerResult();
                        setFilter({});
                    }}>Clear filter</button>
                </div >
            )}

            {scannerResult &&
                <ScannedItem
                    key={scannerResult.code}
                    item={scannerResult}
                    onRefresh={(new_item) => {
                        if (new_item) {
                            setScannerResult(new_item);
                        }
                        refreshItems();
                    }}
                    setFilter={setFilter}
                />}

            {items.map(item => (
                <ExistingItem
                    key={item.content_id}
                    item={item}
                    onRefresh={refreshItems}
                    setFilter={setFilter}
                />
            ))}
        </>
    );
}
