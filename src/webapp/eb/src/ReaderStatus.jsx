function ReaderStatus({ error }) {
    if (!error) return null;
    return (
        <div>
            <span style={{ color: "red" }}>{error}</span>
        </div>
    );
}
