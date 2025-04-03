function ExistingItem({ item, onRefresh, setFilter }) {
    function useContent(content_id) {
        api_use_content(
            {
                content_id: content_id,
                quantity: 1,
            },
            function (data, error) {
                if (!data) {
                    setError("Unable to remove contents, " + error);
                    data = []
                }
                onRefresh();
            }
        );
    }

    return (
        <LineItem
            key={item.content_id}
            item={item}
            actions={[
                {
                    caption: "Similar",
                    onClick: () => {
                        setFilter({
                            category: item.category,
                        });
                    },
                    disabled: !item.category,
                },
                {
                    caption: "Use",
                    onClick: () => { useContent(item.content_id) }
                },
                ...(item.quantity > 1 && item.item_quantity > 1) ? [{
                    caption: "Use pack",
                    onClick: () => {
                        api_remove_content(
                            {
                                content_id: item.content_id,
                            },
                            function (data, error) {
                                if (!data) {
                                    setError("Unable to remove contents, " + error);
                                    data = []
                                }
                                onRefresh();
                            }
                        );
                    },
                }] : [],
            ]}
        />
    );
}
