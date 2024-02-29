function ReaderStatus({ error, onDismiss: onDismiss }) {
    if (!error) return null;
    return (
        <div>
            <span style={{ color: "red" }}>{error}</span>
            <button onClick={onDismiss}>X</button>
        </div>
    );
}
