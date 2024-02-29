function ScannedItem({ item, onClear }) {
    return (
        <div>
            <div>
                <button onClick={onClear}>Clear</button>
            </div>

            <LineItem item={item} >
            </LineItem>
        </div>
    )
}