"use strict";

function LineItem(_ref) {
  var item = _ref.item,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "LineItem",
    style: {
      border: "1px solid"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "itemUpc"
  }, item.upc), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "itemName"
  }, item.name || "Unknown"), children && /*#__PURE__*/React.createElement("br", null), children);
}