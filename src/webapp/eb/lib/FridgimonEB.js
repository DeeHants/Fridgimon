"use strict";

// export default
function FridgimonEB(_ref) {
  var result = _ref.result,
    reader_error = _ref.reader_error;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Fridgimon"), /*#__PURE__*/React.createElement(ReaderStatus, {
    error: reader_error,
    result: result
  }));
}