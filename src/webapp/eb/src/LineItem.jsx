function LineItem({ item, marker, children }) {
    // Create the marker colour style
    if (!marker) {
        marker = !item.expiry ? undefined :
            item.expired ? "red" :
                item.days_left < 2 ? "orange" :
                    "green";
    }
    const item_style = marker ? { borderLeftColor: marker } : undefined;

    return (
        <div className="item" style={item_style}>
            <div className="itemName">{item.name || "Unknown"}</div>
            <div className="itemUpc">{item.upc}</div>
            {item.expiry && (<div className="itemExpiry">{item.expiry}</div>)}

            {children && <br />}
            {children}
        </div>
    );
}
