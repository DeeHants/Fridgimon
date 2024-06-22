<?php
$apis[] = array(
    'pattern' => 'item\/(?:([a-zA-Z0-9]+):)?([0-9]+)',
    'methods' => array("GET"),
    'handler' => "api_item",
);
$apis[] = array(
    'pattern' => 'item',
    'methods' => array("POST"),
    'handler' => "api_item",
);

function api_item($method, $params, $data) {
    global $mysqli;
    $fields = array(
        "code" => "s",
        "code_type" => "s",
        "name" => "s",
        "life" => "i",
        "variant" => "s",
        "category" => "s",
    );

    if ($method == 'POST') {
        $stmt = $mysqli->prepare("INSERT INTO `items` (" . field_names($fields) . ") VALUES (" . field_placeholders($fields) . ")");
        $stmt->bind_param(field_bindtypes($fields), ...field_values($fields, $data));
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }

        // Get the last ID for the lookup
        $item_id = $mysqli->insert_id;

    } elseif ($method == 'GET') {
        // Figure out what we're getting
        $item_id = null;
        $item_code = $params[2] ?? null;
        $item_code_type = $params[1] ?? null;
        if (!$item_code_type && is_numeric($item_code) && $item_code <= 999999) {
            // Numeric and 6 digits or less, it's probably an ID
            $item_id = $item_code + 0;
            $item_code = null;
        }
    }

    // Lookup the resulting item
    if ($item_id != null) {
        $stmt = $mysqli->prepare("SELECT `item_id`, " . field_names($fields) . " FROM `items` WHERE `item_id`=?");
        $stmt->bind_param("i",
            $item_id
        );
    } elseif ($item_code != null) {
        $stmt = $mysqli->prepare("SELECT `item_id`, " . field_names($fields) . " FROM `items` WHERE `code`=? and (`code_type`=? or `code_type` is null or ? is null)");
        $stmt->bind_param("sss",
            $item_code,
            $item_code_type, $item_code_type
        );
    } else {
        return api_error("Nothing to lookup");
    }

    $stmt->execute();
    if ($mysqli->error) { return api_error($mysqli->error); }
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $response = decorate_item($row);
        $response = array_merge(
            $response,
            array(
                'found' => true,
            )
        );
    } else {
        $response = array(
            'found' => false,
            'item_id' => $item_id,
            'code' => $item_code,
            'code_type' => $item_code_type,
        );
    }

    return array(
        'response' => $response,
    );
}
