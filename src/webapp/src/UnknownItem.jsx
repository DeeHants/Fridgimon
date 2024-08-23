function UnknownItem({ item, onRefresh }) {
    // New item
    const [itemName, setItemName] = React.useState("");
    const [itemVariant, setItemVariant] = React.useState(null);
    const [itemCategory, setItemCategory] = React.useState(null);
    const [itemLife, setItemLife] = React.useState(null);

    function registerItem() {
        api_register_new_item(
            {
                code: item.code,
                code_type: item.code_type,
                name: itemName,
                variant: itemVariant,
                category: itemCategory,
                life: itemLife,
            },
            function (data, error) {
                if (!data) {
                    setError("Unable to register item, " + error);
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
            <div className="itemVariantEntry">
                <label>Variant </label>
                <input
                    type="text"
                    value={itemVariant}
                    onChange={e => setItemVariant(e.target.value || null)}
                />
            </div>
            <div className="itemCategoryEntry">
                <label>Category </label>
                <input
                    type="text"
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value || null)}
                />
            </div>
            <div className="itemLifeEntry">
                <label>Expires </label>
                <input
                    type="checkbox"
                    checked={itemLife != null}
                    onChange={e => setItemLife(e.target.checked ? 14 : null)}
                />
            </div>
        </LineItem>
    )
}
