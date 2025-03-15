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
            ]}
        />
    );
}
