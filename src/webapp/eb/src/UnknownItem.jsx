function UnknownItem({ item, onRefresh }) {
    // New item
    const [itemName, setItemName] = React.useState("");
    const [itemLife, setItemLife] = React.useState(null);

    function registerItem() {
        api_register_new_item(
            {
                code: item.code,
                name: itemName,
                life: itemLife,
            },
            function (data, _error) {
                if (!data) {
                    setError("Unable to register item");
                }
                onRefresh(data);
            }
        );
    }

    return (
        <LineItem
            item={item}
            marker="lightgrey"
            actions={[
                {
                    caption: "Register",
                    onClick: registerItem,
                    disabled: itemName == '' || itemName == null
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
            <div className="itemLifeEntry">
                <label>Expires </label>
                <input
                    type="checkbox"
                    checked={itemLife != null}
                    onChange={e => setItemLife(e.target.checked ? 14 : null)}
                />
                <br />
                <label>Life </label>
                <input
                    type="number"
                    value={itemLife || ''}
                    disabled={itemLife == null}
                    onChange={e => setItemLife(e.target.value)}
                />
            </div>
        </LineItem>
    )
}
