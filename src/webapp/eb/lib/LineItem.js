"use strict";

function LineItem(_ref) {
  var item = _ref.item,
    marker = _ref.marker,
    children = _ref.children,
    actions = _ref.actions;
  // Create the marker colour style
  if (!marker) {
    marker = !item.expiry ? undefined : item.expired ? "red" : item.days_left < 2 ? "orange" : "green";
  }
  var item_style = marker ? {
    borderLeftColor: marker
  } : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: "item",
    style: item_style
  }, actions && /*#__PURE__*/React.createElement("div", {
    className: "itemActions"
  }, actions.map(function (action, index) {
    return /*#__PURE__*/React.createElement(LineItemAction, {
      key: index,
      action: action
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "itemName"
  }, item.name || "Unknown"), /*#__PURE__*/React.createElement("div", {
    className: "itemUpc"
  }, item.upc), item.expiry && /*#__PURE__*/React.createElement("div", {
    className: "itemExpiry"
  }, item.expiry), children && /*#__PURE__*/React.createElement("br", null), children);
}