function LineItem({ item, marker, children, actions }) {
    // Create the marker colour style
    // Items are green, orange and red as it approaches and passes expiry, or blue if over 28 days old
    if (!marker) {
        marker =
            item.expiry ?
                item.expired ? "red" :
                    item.days_left < 2 ? "orange" :
                        item.stored_for > 28 ? "blue" : "green" :
                item.stored_for > 28 ? "blue" : undefined;
    }
    const item_style = marker ? { borderLeftColor: marker } : undefined;

    return (
        <div className="item" style={item_style}>
            {actions && (
                <div className="itemActions">
                    {actions.map((action, index) => (
                        <LineItemAction key={index} action={action} />
                    ))}
                </div>
            )}

            <div className="itemName">{item.name || "Unknown"}</div>
            <div className="itemCode">{item.code}</div>
            {item.expiry && (<div className="itemExpiry">{item.expiry}</div>)}

            {children}
        </div>
    );
}
