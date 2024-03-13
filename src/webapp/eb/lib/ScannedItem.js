"use strict";

function ScannedItem(_ref) {
  var item = _ref.item,
    onClear = _ref.onClear;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: onClear
  }, "Clear")), /*#__PURE__*/React.createElement(LineItem, {
    item: item,
    marker: "lightgrey",
    actions: [{
      caption: "Store",
      disabled: !item.found
    }]
  }));
}