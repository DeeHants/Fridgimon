function api_lookup(query, onComplete) {
    api_call(
        "/api/lookup?code=" + query['code'],
        onComplete
    );
}

function api_contents(filter, onComplete) {
    var filter_string = "?";
    if (filter && filter.upc) { filter_string = filter_string + "upc=" + encodeURIComponent(filter.upc) }
    api_call(
        "/api/contents" + filter_string,
        onComplete
    );
}

function api_call(url, onComplete) {
    EB.jQuery.ajax({
        url: url,
        async: true,
        dataType: 'json',
        success: function (data, _status, _jqXHR) {
            onComplete(data, undefined);
        },
        error: function (_jqXHR, errorText, _errorThrown) {
            onComplete(data, errorText);
        }
    });
}
