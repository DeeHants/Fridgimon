"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function FridgimonEB() {
  // Page state
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    isBusy = _React$useState2[0],
    setBusy = _React$useState2[1];
  var _React$useState3 = React.useState(null),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    error = _React$useState4[0],
    setError = _React$useState4[1];
  var _React$useState5 = React.useState(null),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    scannerResult = _React$useState6[0],
    setScannerResult = _React$useState6[1];
  var _React$useState7 = React.useState([]),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    items = _React$useState8[0],
    setItems = _React$useState8[1];

  // Handle scan events
  function lookupItem(scan_data, scan_source, _scan_type) {
    var code_type_parts = scan_source.split(":", 2);
    var code_type = code_type_parts[1];
    api_lookup_item({
      code: scan_data,
      type: code_type
    }, function (data, _error) {
      if (!data) {
        setError("Unable to lookup " + scan_data);
        data = {
          code: scan_data
        };
      }

      // Update the scan results
      setScannerResult(data);
      refreshItems({
        code: data.code
      });
    });
  }

  // Contents
  React.useEffect(function () {
    refreshItems();
  }, []);
  function refreshItems(filter) {
    setBusy(true);
    api_get_contents(filter, function (data, _error) {
      if (!data) {
        setError("Unable to get contents");
        data = [];
      }
      setItems(data);
      setBusy(false);
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Busy, {
    isBusy: isBusy
  }), /*#__PURE__*/React.createElement(Reader, {
    setError: setError,
    onScan: lookupItem
  }), /*#__PURE__*/React.createElement("h1", null, "Fridgimon"), /*#__PURE__*/React.createElement(ReaderStatus, {
    error: error,
    onDismiss: function onDismiss() {
      setError("");
    }
  }), scannerResult && /*#__PURE__*/React.createElement(ScannedItem, {
    key: scannerResult.code,
    item: scannerResult,
    onClear: function onClear() {
      setScannerResult();
      refreshItems();
    },
    onRefresh: function onRefresh(new_item) {
      if (new_item) {
        setScannerResult(new_item);
      }
      refreshItems({
        code: scannerResult.code
      });
    }
  }), items.map(function (item) {
    return /*#__PURE__*/React.createElement(LineItem, {
      key: item.content_id,
      item: item,
      actions: [{
        caption: "Remove",
        disabled: true
      }]
    });
  }));
}