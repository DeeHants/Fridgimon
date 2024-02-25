function ReaderStatus({ result, error }) {
    return (
        <div>
            {error && <span style={{ color: "red" }}>{error}</span>}
            {result && <span>{result.name}</span>}
        </div>
    );
}
