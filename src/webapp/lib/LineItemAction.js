"use strict";

function LineItemAction(_ref) {
  var action = _ref.action;
  return /*#__PURE__*/React.createElement("button", {
    className: "itemAction",
    onClick: action.onClick,
    disabled: action.disabled
  }, action.caption);
}