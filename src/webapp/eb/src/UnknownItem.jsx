function UnknownItem({ item, onRefresh }) {
    // New item
    const [itemName, setItemName] = React.useState("");

    function registerItem() {
        api_register_new_item(
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

    return (
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
    )
}
