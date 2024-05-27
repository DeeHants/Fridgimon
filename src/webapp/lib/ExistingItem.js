"use strict";

function ExistingItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh;
  function deleteContent(content_id) {
    api_remove_content({
      content_id: content_id
    }, function (data, error) {
      if (!data) {
        setError("Unable to remove contents, " + error);
        data = [];
      }
      onRefresh();
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LineItem, {
    key: item.content_id,
    item: item,
    actions: [{
      caption: "Remove",
      onClick: function onClick() {
        deleteContent(item.content_id);
      }
    }]
  }));
}