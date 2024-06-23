"use strict";

function ScannedItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh,
    setFilter = _ref.setFilter;
  return /*#__PURE__*/React.createElement(React.Fragment, null, !item.found && /*#__PURE__*/React.createElement(UnknownItem, {
    item: item,
    onRefresh: onRefresh,
    setFilter: setFilter
  }), item.found && /*#__PURE__*/React.createElement(NewItem, {
    item: item,
    onRefresh: onRefresh,
    setFilter: setFilter
  }));
}