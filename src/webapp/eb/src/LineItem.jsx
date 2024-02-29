function LineItem({ item, children }) {
    return (
        <div
            className="LineItem"
            style={{ border: "1px solid" }}
        >
            <span className="itemUpc">{item.upc}</span>
            <br />
            <span className="itemName">{item.name || "Unknown"}</span>
            <br />
            {item.expiry && (<span className="itemExpiry">{item.expiry}</span>)}
            {children && <br />}
            {children}
        </div>
    );
}
