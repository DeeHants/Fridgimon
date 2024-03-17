"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function UnknownItem(_ref) {
  var item = _ref.item,
    onRefresh = _ref.onRefresh;
  // New item
  var _React$useState = React.useState(""),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    itemName = _React$useState2[0],
    setItemName = _React$useState2[1];
  var _React$useState3 = React.useState(null),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    itemLife = _React$useState4[0],
    setItemLife = _React$useState4[1];
  function registerItem() {
    api_register_new_item({
      code: item.code,
      name: itemName,
      life: itemLife
    }, function (data, _error) {
      if (!data) {
        setError("Unable to register item");
      }
      onRefresh(data);
    });
  }
  return /*#__PURE__*/React.createElement(LineItem, {
    item: item,
    marker: "lightgrey",
    actions: [{
      caption: "Register",
      onClick: registerItem,
      disabled: itemName == '' || itemName == null
    }]
  }, /*#__PURE__*/React.createElement("div", {
    className: "itemNameEntry"
  }, /*#__PURE__*/React.createElement("label", null, "Name "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: itemName,
    onChange: function onChange(e) {
      return setItemName(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "itemLifeEntry"
  }, /*#__PURE__*/React.createElement("label", null, "Expires "), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: itemLife != null,
    onChange: function onChange(e) {
      return setItemLife(e.target.checked ? 14 : null);
    }
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", null, "Life "), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: itemLife || '',
    disabled: itemLife == null,
    onChange: function onChange(e) {
      return setItemLife(e.target.value);
    }
  })));
}