"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function NewItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh;
  // Expiry date
  var current_date = new Date();
  var current_date_string = "".concat(current_date.getFullYear(), "-").concat(("0" + current_date.getMonth()).substr(-2), "-").concat(("0" + current_date.getDate()).substr(-2));
  var expiry_date = undefined;
  var expiry_date_string = undefined;
  if (item.expires) {
    expiry_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate() + item.life);
    expiry_date_string = "".concat(expiry_date.getFullYear(), "-").concat(("0" + expiry_date.getMonth()).substr(-2), "-").concat(("0" + expiry_date.getDate()).substr(-2));
  }
  var _React$useState = React.useState(expiry_date_string),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    expiryValue = _React$useState2[0],
    setExpiryValue = _React$useState2[1];
  function storeItem() {
    var content = {
      item_id: item.item_id
    };
    if (item.expires) {
      content['expiry'] = expiryValue;
    }
    api_store_new_content(content, function (data, error) {
      if (!data) {
        setError("Unable to store item contents, " + error);
      }
      onRefresh();
    });
  }
  return /*#__PURE__*/React.createElement(LineItem, {
    item: item,
    marker: "lightgrey",
    actions: [{
      caption: "Store",
      onClick: storeItem
    }]
  }, item.expires && /*#__PURE__*/React.createElement("div", {
    className: "itemExpiryEntry"
  }, /*#__PURE__*/React.createElement("label", null, "Expiry "), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: expiryValue,
    min: current_date_string,
    onChange: function onChange(e) {
      return setExpiryValue(e.target.value);
    }
  })));
}