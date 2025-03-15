"use strict";

function ExistingItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh,
    setFilter = _ref.setFilter;
  function useContent(content_id) {
    api_use_content({
      content_id: content_id,
      quantity: 1
    }, function (data, error) {
      if (!data) {
        setError("Unable to remove contents, " + error);
        data = [];
      }
      onRefresh();
    });
  }
  return /*#__PURE__*/React.createElement(LineItem, {
    key: item.content_id,
    item: item,
    actions: [{
      caption: "Similar",
      onClick: function onClick() {
        setFilter({
          category: item.category
        });
      },
      disabled: !item.category
    }, {
      caption: "Use",
      onClick: function onClick() {
        useContent(item.content_id);
      }
    }]
  });
}