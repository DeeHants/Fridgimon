"use strict";

function ScanResult(_ref) {
  var result = _ref.result;
  if (!result) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "itemUpc"
  }, result.upc), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "itemName"
  }, result.name || "Unknown"));
}