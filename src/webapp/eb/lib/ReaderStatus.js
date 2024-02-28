"use strict";

function ReaderStatus(_ref) {
  var error = _ref.error;
  if (!error) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "red"
    }
  }, error));
}