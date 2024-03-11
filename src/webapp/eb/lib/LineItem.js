"use strict";

function LineItem(_ref) {
  var item = _ref.item,
    children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "itemName"
  }, item.name || "Unknown"), /*#__PURE__*/React.createElement("div", {
    className: "itemUpc"
  }, item.upc), item.expiry && /*#__PURE__*/React.createElement("div", {
    className: "itemExpiry"
  }, item.expiry), children && /*#__PURE__*/React.createElement("br", null), children);
}