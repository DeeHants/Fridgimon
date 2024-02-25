"use strict";

function ReaderStatus(_ref) {
  var result = _ref.result,
    error = _ref.error;
  return /*#__PURE__*/React.createElement("div", null, error && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "red"
    }
  }, error), result && /*#__PURE__*/React.createElement("span", null, result.name));
}