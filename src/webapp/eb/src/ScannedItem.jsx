function ScannedItem({ item, onClear, onRefresh }) {
    // New item
    const [itemName, setItemName] = React.useState("");

    function registerItem() {
        api_register(
            {
                code: item.code,
                name: itemName,
            },
            function (data, _error) {
                if (!data) {
                    setError("Unable to register item");
                }
                onRefresh(data);
            }
        );
    }

    // Expiry date
    var current_date = new Date();
    var current_date_string = current_date.toISOString().substring(0, 10)
    var expiry_date = undefined;
    var expiry_date_string = undefined;
    if (item.life) {
        expiry_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate() + item.life)
        expiry_date_string = expiry_date.toISOString().substring(0, 10)
    }
    const [expiryValue, setExpiryValue] = React.useState(expiry_date_string);

    function storeItem() {
        api_store(
            item.item_id,
            item.expires ? expiryValue : undefined,
            function (data, _error) {
                if (!data) {
                    setError("Unable to store item contents");
                }
                onRefresh();
            }
        );
    }

    return (
        <>
            <div>
                <button onClick={onClear}>Clear</button>
            </div>

            {/* Register a new item */}
            {!item.found && (
                <LineItem
                    item={item}
                    marker="lightgrey"
                    actions={[
                        {
                            caption: "Register",
                            onClick: registerItem
                        }
                    ]}
                >
                    <div className="itemNameEntry">
                        <label>Name </label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={e => setItemName(e.target.value)}
                        />
                    </div>
                </LineItem>
            )}

            {/* Store a found item */}
            {item.found && (
                <LineItem
                    item={item}
                    marker="lightgrey"
                    actions={[
                        {
                            caption: "Store",
                            onClick: storeItem
                        }
                    ]}
                >
                    {item.expires &&
                        (<div className="itemExpiryEntry">
                            <label>Expiry </label>
                            <input
                                type="date"
                                value={expiryValue}
                                min={current_date_string}
                                onChange={e => setExpiryValue(e.target.value)}
                            />
                        </div>)}
                </LineItem>
            )}
        </>
    )
}
