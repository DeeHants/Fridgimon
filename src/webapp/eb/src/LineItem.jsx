function LineItem({ item, children }) {
    return (
        <div className="item">
            <div className="itemName">{item.name || "Unknown"}</div>
            <div className="itemUpc">{item.upc}</div>
            {item.expiry && (<div className="itemExpiry">{item.expiry}</div>)}

            {children && <br />}
            {children}
        </div>
    );
}
