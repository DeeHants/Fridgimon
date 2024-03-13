function api_lookup(query, onComplete) {
    api_call(
        "lookup",
        query,
        onComplete
    );
}

function api_contents(filter, onComplete) {
    api_call(
        "contents",
        filter,
        onComplete
    );
}

function api_call(method, parameters, onComplete) {
    // Build the parameter string
    var parameter_string = "";
    for (var key in parameters) {
        parameter_string += (parameter_string == "" ? "" : "&")
        parameter_string += key + "=" + encodeURIComponent(parameters[key])
    }
    parameter_string = (parameter_string != "" ? "?" : "") + parameter_string
    // and full URL
    var url = "/api/" + method + parameter_string;

    // and get!
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
