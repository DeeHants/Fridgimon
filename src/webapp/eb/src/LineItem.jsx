function LineItem({ item, children }) {
    return (
        <div
            className="LineItem"
            style={{ border: "1px solid" }}
        >
            <span className="itemUpc">{item.upc}</span>
            <br />
            <span className="itemName">{item.name || "Unknown"}</span>
            {children && <br />}
            {children}
        </div>
    );
}
