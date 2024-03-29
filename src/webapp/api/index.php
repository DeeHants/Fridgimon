<?php
$apis = array(
    array(
        'pattern' => 'hello',
        'methods' => array("GET"),
        'handler' => "api_hello",
    ),

    // Item handling
    array(
        'pattern' => 'item\/(?:([a-zA-Z0-9]+):)?([0-9]+)',
        'methods' => array("GET"),
        'handler' => "api_item",
    ),
    array(
        'pattern' => 'item',
        'methods' => array("POST"),
        'handler' => "api_item",
    ),

    // Contents handling
    array(
        'pattern' => 'contents(?:\/(?:([a-zA-Z0-9]+):)?([0-9]+))?',
        'methods' => array("GET"),
        'handler' => "api_contents",
    ),
    array(
        'pattern' => "content",
        'methods' => array("POST"),
        'handler' => "api_contents",
    ),
    array(
        'pattern' => "content\/([0-9]+)",
        'methods' => array("DELETE"),
        'handler' => "api_contents",
    ),
);

// Default response
$status = 200;
$response = array();
$error = "";

// Database connection
require '../db.inc.php';
$mysqli = new mysqli($mysqli_hostname, $mysqli_username, $mysqli_password, $mysqli_database, $mysqli_port);

// Determine what's being requested
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'];

// Check for the API
$api_found = false;
foreach ($apis as $api) {
    $matches = array();
    $pattern = '/^\/' . $api['pattern'] . "$/";
    if (preg_match($pattern, $path, $matches) !== 1) {
        continue;
    }
    $api_found = true;

    // Supported methods
    if (array_search($method, $api['methods']) === false) {
        $status = 405;
        $error = "This API doesn't accept $method calls";
        break;
    }

    // Any data?
    if ($method == 'POST' || $method== 'PUT') {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);
    } else {
        $data = null;
    }

    // Call the handler
    $handler = $api['handler'];
    $result = $handler($method, $matches, $data);

    // Set the results
    if (array_key_exists('response', $result)) { $response = $result['response']; }
    if (array_key_exists('status', $result)) { $status = $result['status']; }
    if (array_key_exists('error', $result)) { $error = $result['error']; }
    break;
}
if (!$api_found) {
    $status = 400;
    $error = "Unknown API";
}

// If there was an error, create the response
if ($error) {
    $response = array(
        'error' => $error,
    );
}

// Output the response as JSON
http_response_code($status);
header("Content-Type: application/json");
print json_encode($response, JSON_PRETTY_PRINT);

function api_hello($method, $params, $data) {
    $response = array(
        'hello' => "Hello " . $_SERVER['REMOTE_ADDR'],
    );
    return array(
        'response' => $response,
    );
}

function api_item($method, $params, $data) {
    global $mysqli;
    $fields = array(
        "code" => "s",
        "code_type" => "s",
        "name" => "s",
        "life" => "i",
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
        if (($params[2] ?? 0) > 9999999 || ($params[1] ?? null)) {
            // 8 digits or has a type is most likely a EAN/UPC
            $item_id = null;
            $item_code = $params[2];
            $item_code_type = $params[1] ?? null;
        } else {
            // otherwise an ID
            $item_id = $params[2];
            $item_code = null;
            $item_code_type = null;
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
        $response = array_merge(
            $row,
            array(
                'found' => true,
                'expires' => $row['life'] !== null,
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
        if (($params[2] ?? 0) > 9999999 || ($params[1] ?? null)) {
            // 8 digits or has a type is most likely a EAN/UPC
            $item_id = null;
            $item_code = $params[2];
            $item_code_type = $params[1] ?? null;
        } elseif ($params[2] ?? null) {
            // otherwise an ID
            $item_id = $params[2];
            $item_code = null;
            $item_code_type = null;
        } else {
            $item_id = null;
            $item_code = null;
            $item_code_type = null;
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
        $current_date = new DateTime(date('Y-m-d'));
        // Check the expiry
        if ($row['expiry'] != '') {
            $expiry_date = new DateTime($row['expiry']);
            $interval = $current_date->diff($expiry_date);
            $days_left = $interval->days * ($interval->invert ? -1 : 1);
            $row['days_left'] = $days_left;
            $row['expired'] = $days_left < 0;
        }

        // Determine age
        $added_date = new DateTime($row['added']);
        $interval = $added_date->diff($current_date);
        $days_stored = $interval->days * ($interval->invert ? -1 : 1);
        $row['stored_for'] = $days_stored;

        $response[] = $row;
    }

    return array(
        'response' => $response,
    );
}

function api_error($message, $status = 500) {
    error_log("Returning $message");
    return array(
        'error' => $message,
        'status' => $status,
    );
}

/**
 * Returns a list of quoted field names with an optional prefix, suitable for use in select or insert queries.
 *
 * @param  array $fields Field array to use
 * @param  string $prefix Table prefix to add to each field name
 * @return string
 */
function field_names($fields, $prefix = "") {
    $names = array_keys($fields);
    $names = array_map(function ($name) { return "`$name`"; }, $names);
    if ($prefix != "") {
        $names = array_map(function ($name) use ($prefix) { return "`$prefix`.$name"; }, $names);
    }
    return implode(", ", $names);
}

/**
 * Returns a list of placeholders for the field array, suitable for use in insert queries.
 *
 * @param  array $fields Field array to use
 * @return string
 */
function field_placeholders($fields) {
    $names = array_keys($fields);
    $names = array_map(function ($name) { return "?"; }, $names);
    return implode(", ", $names);
}

/**
 * Returns a string containing the bind types for the field array, suitable for use with bind_param
 *
 * @param  array $fields Field array to use
 * @return string
 */
function field_bindtypes($fields) {
    $types = array_values($fields);
    return implode("", $types);
}

/**
 * Returns an array of values for the field array, suitable for use with bind_param
 *
 * @param  array $fields Field array to use
 * @param  array $data Array to extract the named values from
 * @return array
 */
function field_values($fields, $data) {
    $names = array_keys($fields);
    $values = array();
    foreach ($names as $name) {
        $values[] = array_key_exists($name, $data) ? $data[$name] : null;
    }
    return $values;
}

?>