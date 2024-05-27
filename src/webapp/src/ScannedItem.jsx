function ScannedItem({ item, onClear, onRefresh }) {
    return (
        <>
            <div>
                <button onClick={onClear}>Clear</button>
            </div>

            {/* Register a new item */}
            {!item.found && (
                <UnknownItem
                    item={item}
                    onRefresh={onRefresh}
                />
            )}

            {/* Store a found item */}
            {item.found && (
                <NewItem
                    item={item}
                    onRefresh={onRefresh}
                />
            )}
        </>
    )
}
