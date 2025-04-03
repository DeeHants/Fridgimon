"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ExistingItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh,
    setFilter = _ref.setFilter;
  return /*#__PURE__*/React.createElement(LineItem, {
    key: item.content_id,
    item: item,
    actions: [{
      caption: "Similar",
      onClick: function onClick() {
        setFilter({
          category: item.category
        });
      },
      disabled: !item.category
    }, {
      caption: "Use",
      onClick: function onClick() {
        api_use_content({
          content_id: content_id,
          quantity: 1
        }, function (data, error) {
          if (!data) {
            setError("Unable to remove contents, " + error);
            data = [];
          }
          onRefresh();
        });
      }
    }].concat(_toConsumableArray(item.quantity > 1 && item.item_quantity > 1 ? [{
      caption: "Use pack",
      onClick: function onClick() {
        api_remove_content({
          content_id: item.content_id
        }, function (data, error) {
          if (!data) {
            setError("Unable to remove contents, " + error);
            data = [];
          }
          onRefresh();
        });
      }
    }] : []))
  });
}