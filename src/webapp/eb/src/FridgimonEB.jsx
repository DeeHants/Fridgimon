function FridgimonEB() {
    // Page state
    const [isBusy, setBusy] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [scannerResult, setScannerResult] = React.useState(null);

    const [items, setItems] = React.useState([
        {
            "content_id": 1,
            "upc": "5060947546080",
            "name": "Monster - Pipeline punch",
        },
        {
            "content_id": 2,
            "upc": "5060947546080",
            "name": "Monster - Pipeline punch",
        },
        {
            "content_id": 7,
            "upc": "5000128104517",
            "name": "Whole milk, 4 pint - Co-op",
            "expiry": "2024-02-23"
        },
        {
            "content_id": 8,
            "upc": "5000128104517",
            "name": "Whole milk, 4 pint - Co-op",
            "expiry": "2024-03-02"
        },
        {
            "content_id": 9,
            "upc": "5060947547360",
            "name": "Monster - Khaotic",
        },
    ]);

    return (
        <>
            <Busy isBusy={isBusy} />
            {/* Invisible component to manage the reader */}
            <Reader
                onError={setError}
                onScan={setScannerResult}
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
                    key={scannerResult.upc}
                    item={scannerResult}
                    onClear={() => { setScannerResult() }}
                />}

            {items.map(item => (
                <LineItem
                    key={item.content_id}
                    item={item}
                />
            ))}
        </>
    );
}
