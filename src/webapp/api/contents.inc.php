<?php
$apis[] = array(
    'pattern' => 'contents(?:\/(?:([a-zA-Z0-9]+):)?([0-9]+))?',
    'methods' => array("GET"),
    'handler' => "api_contents",
);
$apis[] = array(
    'pattern' => "content",
    'methods' => array("POST"),
    'handler' => "api_contents",
);
$apis[] = array(
    'pattern' => "content\/([0-9]+)",
    'methods' => array("DELETE"),
    'handler' => "api_contents",
);

function api_contents($method, $params, $data) {
    global $mysqli;
    $fields = array(
        "item_id" => "i",
        "added" => "s",
        "expiry" => "s",
    );
    $item_fields = array(
        "code" => "s",
        "name" => "s",
        "variant" => "s",
        "category" => "s",
    );

    if ($method == 'POST') {
        if (!$data['added']) { $data['added'] = date('Y-m-d'); }
        $stmt = $mysqli->prepare("INSERT INTO `contents` (" . field_names($fields) . ", `container_id`) VALUES (" . field_placeholders($fields) . ", 1)");
        $stmt->bind_param(field_bindtypes($fields), ...field_values($fields, $data));
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }

        // Get the last ID for the lookup
        $item_id = $mysqli->insert_id;

    } elseif ($method == 'DELETE') {
        // Get the existing item ID
        $stmt = $mysqli->prepare("SELECT `content_id`, `item_id` FROM `contents` WHERE `content_id` = ?");
        $stmt->bind_param("i",
            $params[1]
        );
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $item_id = $row['item_id'];
        }

        // Delete the item
        $stmt = $mysqli->prepare("DELETE FROM `contents` WHERE `content_id` = ?");
        $stmt->bind_param("i",
            $params[1]
        );
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }

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

    // Lookup the contents
    if ($item_id != null) {
        $stmt = $mysqli->prepare("SELECT `content_id`, " . field_names($fields, "contents") . ", " . field_names($item_fields, "items") . ", `container_id` as `container` FROM `contents` LEFT JOIN `items` ON `contents`.`item_id` = `items`.`item_id` WHERE `items`.`item_id`=?");
        $stmt->bind_param("i", $item_id);
    } elseif ($item_code != null) {
        $stmt = $mysqli->prepare("SELECT `content_id`, " . field_names($fields, "contents") . ", " . field_names($item_fields, "items") . ", `container_id` as `container` FROM `contents` LEFT JOIN `items` ON `contents`.`item_id` = `items`.`item_id` WHERE `code`=?");
        $stmt->bind_param("s", $item_code);
    } else {
        $stmt = $mysqli->prepare("SELECT `content_id`, " . field_names($fields, "contents") . ", " . field_names($item_fields, "items") . ", `container_id` as `container` FROM `contents` LEFT JOIN `items` ON `contents`.`item_id` = `items`.`item_id`");
    }

    $stmt->execute();
    if ($mysqli->error) { return api_error($mysqli->error); }
    $result = $stmt->get_result();

    $response = array();
    while($row = $result->fetch_assoc()) {
        $row = decorate_content($row);
        $response[] = $row;
    }

    return array(
        'response' => $response,
    );
}
