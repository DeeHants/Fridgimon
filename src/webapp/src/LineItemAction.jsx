function LineItemAction({ action }) {
    return (
        <button
            className="itemAction"
            onClick={action.onClick}
            disabled={action.disabled}
        >
            {action.caption}
        </button>
    );
}
