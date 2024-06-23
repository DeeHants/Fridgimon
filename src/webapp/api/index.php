<?php
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

# API modules
$apis = array(
    array(
        'pattern' => 'hello',
        'methods' => array("GET"),
        'handler' => "api_hello",
    ),
);
require("items.inc.php");
require("contents.inc.php");

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
    $result = $handler($api, $method, $matches, $data);

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

// UTF-8 encode all values
array_walk_recursive($response, function (&$item, $key) {
    if (!is_string($item)) { return; }
    $item = mb_convert_encoding($item, 'UTF-8', 'ISO-8859-1'); # ISO-8859-1 may be specific to my setup, change as needed
});

// Output the response as JSON
http_response_code($status);
header("Content-Type: application/json");
print json_encode($response, JSON_PRETTY_PRINT);

function api_hello($api, $method, $params, $data) {
    $response = array(
        'hello' => "Hello " . $_SERVER['REMOTE_ADDR'],
    );
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
 * Add additional generated fields to a "item" entry retrieved from the database.
 *
 * @param  array $row The original database row record from $result->fetch_assoc()
 * @return array The modified database row record
 */
function decorate_item($row) {
    $row = array_merge(
        $row,
        array(
            'expires' => $row['life'] !== null,
        )
    );
    return $row;
}

/**
 * Add additional generated fields to a "content" entry retrieved from the database.
 *
 * @param  array $row The original database row record from $result->fetch_assoc()
 * @return array The modified database row record
 */
function decorate_content($row) {
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

    return $row;
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