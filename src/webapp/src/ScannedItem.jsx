function ScannedItem({ item, onRefresh, setFilter }) {
    return (
        <>
            {/* Register a new item */}
            {!item.found && (
                <UnknownItem
                    item={item}
                    onRefresh={onRefresh}
                    setFilter={setFilter}
                />
            )}

            {/* Store a found item */}
            {item.found && (
                <NewItem
                    item={item}
                    onRefresh={onRefresh}
                    setFilter={setFilter}
                />
            )}
        </>
    )
}
