function ScannedItem({ item, onClear }) {
    return (
        <>
            <div>
                <button onClick={onClear}>Clear</button>
            </div>

            <LineItem
                item={item}
                marker="lightgrey"
                actions={[
                    {
                        caption: "Store",
                        disabled: !item.found,
                    }
                ]}
            >
            </LineItem>
        </>
    )
}
