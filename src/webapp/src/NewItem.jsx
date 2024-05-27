Date.prototype.toISODateString = function () {
    // Format a DateTime as a local ISO date, yyyy-mm-dd
    return `${this.getFullYear()}-${("0" + (this.getMonth() + 1)).substr(-2)}-${("0" + this.getDate()).substr(-2)}`;
};

function NewItem({ item, onRefresh }) {
    // Expiry date
    var current_date = new Date();
    var current_date_string = current_date.toISODateString();
    var expiry_date = undefined;
    var expiry_date_string = undefined;
    if (item.expires) {
        expiry_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate() + item.life,);
        expiry_date_string = expiry_date.toISODateString();
    }
    const [expiryValue, setExpiryValue] = React.useState(expiry_date_string);
    const expiry_date_element = React.useRef(null);

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
                    <button onClick={() => {
                        expiry_date_element.current.stepDown();
                        setExpiryValue(expiry_date_element.current.value);
                    }}>&lt;&ndash;</button>
                    <input
                        ref={expiry_date_element}
                        type="date"
                        value={expiryValue}
                        min={current_date_string}
                        onChange={e => setExpiryValue(e.target.value)}
                    />
                    <button onClick={() => {
                        expiry_date_element.current.stepUp();
                        setExpiryValue(expiry_date_element.current.value);
                    }}>&ndash;&gt;</button>
                </div>)}
        </LineItem>
    )
}
