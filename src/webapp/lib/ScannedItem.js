"use strict";

function ScannedItem(_ref) {
  var item = _ref.item,
    onClear = _ref.onClear,
    onRefresh = _ref.onRefresh;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: onClear
  }, "Clear")), !item.found && /*#__PURE__*/React.createElement(UnknownItem, {
    item: item,
    onRefresh: onRefresh
  }), item.found && /*#__PURE__*/React.createElement(NewItem, {
    item: item,
    onRefresh: onRefresh
  }));
}