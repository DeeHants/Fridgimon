function api_lookup_item(query, onComplete) {
    var code = query['code'];
    if (query['type']) {
        code = query['type'] + ":" + code;
    }
    var call = "item/" + encodeURIComponent(code);
    api_call(
        'GET', call, undefined,
        onComplete
    );
}

function api_get_contents(filter, onComplete) {
    var call = "contents";
    if (filter && filter['code']) {
        call += "/" + encodeURIComponent(filter['code']);
    }
    api_call(
        'GET', call, undefined,
        onComplete
    );
}

function api_register_new_item(item, onComplete) {
    api_call(
        'POST', "item", item,
        onComplete
    )
}

function api_store_new_content(content, onComplete) {
    api_call(
        'POST', "content", content,
        onComplete
    );
}

function api_remove_content(content, onComplete) {
    var call = "content/" + content['content_id'];
    api_call(
        'DELETE', call, undefined,
        onComplete
    );
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
        success: function (data, _status, _jqXHR) {
            onComplete(data, undefined);
        },
        error: function (_jqXHR, errorText, _errorThrown) {
            onComplete(undefined, errorText);
        }
    });
}
