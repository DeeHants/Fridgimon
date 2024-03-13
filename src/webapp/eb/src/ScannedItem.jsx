function ScannedItem({ item, onClear }) {
    return (
        <>
            <div>
                <button onClick={onClear}>Clear</button>
            </div>

            <LineItem
                item={item}
                marker="lightgrey"
            >
            </LineItem>
        </>
    )
}
