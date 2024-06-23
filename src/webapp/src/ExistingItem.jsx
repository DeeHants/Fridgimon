function ExistingItem({ item, onRefresh, setFilter }) {
    function deleteContent(content_id) {
        api_remove_content(
            {
                content_id: content_id,
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
        <>
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
                        }
                    },
                    {
                        caption: "Remove",
                        onClick: () => { deleteContent(item.content_id) }
                    },
                ]}
            />

        </>
    );
}
