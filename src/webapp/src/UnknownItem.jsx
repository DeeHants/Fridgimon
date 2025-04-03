function UnknownItem({ item, onRefresh }) {
    // New item
    const [itemName, setItemName] = React.useState("");
    const [itemQualification, setItemQualification] = React.useState(null);
    const [itemQuantity, setItemQuantity] = React.useState(null);
    const [itemSize, setItemSize] = React.useState(null);
    const [itemVariant, setItemVariant] = React.useState('');
    const [itemCategory, setItemCategory] = React.useState(null);
    const [itemLife, setItemLife] = React.useState(null);

    function registerItem() {
        var name = itemName;
        if (itemQualification) { name += ' - ' + itemQualification }
        if (itemSize) { name += ' - ' + itemSize }
        api_register_new_item(
            {
                code: item.code,
                code_type: item.code_type,
                name: name,
                quantity: itemQuantity,
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
            <div className="itemEntry itemNameEntry">
                <label>Name</label>
                <input
                    type="text"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                />
            </div>
            <div className="itemEntry itemQualificationEntry">
                <label>Qualification</label>
                <input
                    type="text"
                    value={itemQualification}
                    onChange={e => setItemQualification(e.target.value || null)}
                />
            </div>
            <div className="itemEntry itemQuantityEntry">
                <label>Quantity</label>
                <input
                    type="number"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(e.target.value || null)}
                />
            </div>
            <div className="itemEntry itemSizeEntry">
                <label>Size</label>
                <input
                    type="text"
                    value={itemSize}
                    onChange={e => setItemSize(e.target.value || null)}
                />
            </div>
            <div className="itemEntry itemVariantEntry">
                <label>Variant</label>
                <input
                    type="text"
                    value={itemVariant}
                    onChange={e => setItemVariant(e.target.value || null)}
                />
            </div>
            <div className="itemEntry itemCategoryEntry">
                <label>Category</label>
                <input
                    type="text"
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value || null)}
                />
            </div>
            <div className="itemEntry itemLifeEntry">
                <label>Expires</label>
                <input
                    type="checkbox"
                    checked={itemLife != null}
                    onChange={e => setItemLife(e.target.checked ? 14 : null)}
                />
            </div>
        </LineItem>
    )
}
