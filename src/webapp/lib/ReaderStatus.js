"use strict";

function ReaderStatus(_ref) {
  var error = _ref.error,
    onDismiss = _ref.onDismiss;
  if (!error) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "red"
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss
  }, "X"));
}