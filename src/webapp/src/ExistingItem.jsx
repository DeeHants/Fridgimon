function ExistingItem({ item, onRefresh, setFilter }) {
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
                    onClick: () => {
                        api_use_content(
                            {
                                content_id: item.content_id,
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
                    },
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
