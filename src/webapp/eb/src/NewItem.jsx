function NewItem({ item, onRefresh }) {
    // Expiry date
    var current_date = new Date();
    var current_date_string = `${current_date.getFullYear()}-${("0" + current_date.getMonth()).substr(-2)}-${("0" + current_date.getDate()).substr(-2)}`;
    var expiry_date = undefined;
    var expiry_date_string = undefined;
    if (item.expires) {
        expiry_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate() + item.life,);
        expiry_date_string = `${expiry_date.getFullYear()}-${("0" + expiry_date.getMonth()).substr(-2)}-${("0" + expiry_date.getDate()).substr(-2)}`;
    }
    const [expiryValue, setExpiryValue] = React.useState(expiry_date_string);

    function storeItem() {
        var content = {
            item_id: item.item_id,
        };
        if (item.expires) { content['expiry'] = expiryValue; }

        api_store_new_content(
            content,
            function (data, error) {
                if (!data) {
                    setError("Unable to store item contents, " + error);
                }
                onRefresh();
            }
        );
    }

    return (
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
    )
}
