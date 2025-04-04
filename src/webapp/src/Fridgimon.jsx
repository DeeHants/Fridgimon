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

                data.sort(sortFunc);
                setItems(data);
                setBusy(false);
            }
        );
    }

    // Sorting
    const sortOptions = [
        'expiry',
        'name',
        'added',
    ]
    const [sortOrder, setSortOrder] = React.useState(sortOptions[0]);

    React.useEffect(() => {
        sortItems();
    }, [sortOrder]);

    function sortItems() {
        var newItems = [...items]
        newItems.sort(sortFunc);
        setItems(newItems);
    }

    function sortFunc(a, b) {
        a = a[sortOrder];
        b = b[sortOrder];

        if (a === null && b == null) { return 0 }
        else if (a === null) { return 1 }
        else if (b === null) { return -1 }
        else { return a.localeCompare(b); }
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

            <div className="buttonbar">
                {(scannerResult || filter.code || filter.category) && (
                    <button onClick={() => {
                        setScannerResult();
                        setFilter({});
                    }}>Clear filter</button>
                )}

                {sortOrder == "expiry" && (
                    <button onClick={() => { setSortOrder("name"); }}>Sort by name</button>
                )}
                {sortOrder == "name" && (
                    <button onClick={() => { setSortOrder("added"); }}>Sort by added</button>
                )}
                {sortOrder == "added" && (
                    <button onClick={() => { setSortOrder("expiry"); }}>Sort by expiry</button>
                )}
            </div>

            <div>
                {scannerResult && (
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
                    />
                )}

                {items.map(item => (
                    <ExistingItem
                        key={item.content_id}
                        item={item}
                        onRefresh={refreshItems}
                        setFilter={setFilter}
                    />
                ))}
            </div>

            {/* EB won't adjust scroll height with the keyboard visible so increase the page height */}
            {eb && scannerResult && !scannerResult.found && items.length == 0 && (
                <div style={{ height: "250px" }}></div>
            )}
        </>
    );
}
