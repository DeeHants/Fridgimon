"use strict";

function api_lookup_item(query, onComplete) {
  var call = "item/" + encodeURIComponent(query['code']);
  if (query['type']) {
    call += "/" + encodeURIComponent(query['type']);
  }
  api_call('GET', call, undefined, onComplete);
}
function api_get_contents(filter, onComplete) {
  var call = "contents";
  if (filter && filter['code']) {
    call += "/" + encodeURIComponent(filter['code']);
  }
  api_call('GET', call, undefined, onComplete);
}
function api_register_new_item(item, onComplete) {
  api_call('POST', "item", item, onComplete);
}
function api_store_new_content(item, onComplete) {
  api_call('POST', "content", item, onComplete);
}
function api_call(method, path, data, onComplete) {
  // Build the full URL
  var url = "/api/" + path;

  // and get!
  EB.jQuery.ajax({
    type: method,
    url: url,
    data: data == undefined ? undefined : JSON.stringify(data),
    async: true,
    dataType: 'json',
    success: function success(data, _status, _jqXHR) {
      onComplete(data, undefined);
    },
    error: function error(_jqXHR, errorText, _errorThrown) {
      onComplete(undefined, errorText);
    }
  });
}