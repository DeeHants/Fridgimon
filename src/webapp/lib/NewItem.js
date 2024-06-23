"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
Date.prototype.toISODateString = function () {
  // Format a DateTime as a local ISO date, yyyy-mm-dd
  return "".concat(this.getFullYear(), "-").concat(("0" + (this.getMonth() + 1)).substr(-2), "-").concat(("0" + this.getDate()).substr(-2));
};
function NewItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh,
    setFilter = _ref.setFilter;
  // Expiry date
  var current_date = new Date();
  var current_date_string = current_date.toISODateString();
  var expiry_date = undefined;
  var expiry_date_string = undefined;
  if (item.expires) {
    expiry_date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate() + item.life);
    expiry_date_string = expiry_date.toISODateString();
  }
  var _React$useState = React.useState(expiry_date_string),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    expiryValue = _React$useState2[0],
    setExpiryValue = _React$useState2[1];
  var expiry_date_element = React.useRef(null);
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
      caption: "Similar",
      onClick: function onClick() {
        setFilter({
          category: item.category
        });
      }
    }, {
      caption: "Store",
      onClick: storeItem
    }]
  }, item.expires && /*#__PURE__*/React.createElement("div", {
    className: "itemExpiryEntry"
  }, /*#__PURE__*/React.createElement("label", null, "Expiry "), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      expiry_date_element.current.stepDown();
      setExpiryValue(expiry_date_element.current.value);
    }
  }, "<\u2013"), /*#__PURE__*/React.createElement("input", {
    ref: expiry_date_element,
    type: "date",
    value: expiryValue,
    min: current_date_string,
    onChange: function onChange(e) {
      return setExpiryValue(e.target.value);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      expiry_date_element.current.stepUp();
      setExpiryValue(expiry_date_element.current.value);
    }
  }, "\u2013>")));
}