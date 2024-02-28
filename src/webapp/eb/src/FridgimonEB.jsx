function FridgimonEB({ result, reader_error }) {
    return (
        <div>
            <h1>Fridgimon</h1>
            <ReaderStatus
                error={reader_error}
            />
            {result && <ScanResult
                result={result}
            />}
        </div>
    );
}
