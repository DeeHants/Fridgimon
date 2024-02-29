function FridgimonEB() {
    // Page state
    const [error, setError] = React.useState(null);
    const [scannerResult, setScannerResult] = React.useState(null);

    return (
        <div>
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
            {scannerResult && <ScanResult
                result={scannerResult}
            />}
        </div>
    );
}
