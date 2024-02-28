function ScanResult({ result }) {
    if (!result) return null;
    return (
        <div>
            <span className="itemUpc">{result.upc}</span>
            <br />
            <span className="itemName">{result.name || "Unknown"}</span>
        </div>
    );
}
