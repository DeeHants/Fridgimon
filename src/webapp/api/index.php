<?php
// Default response
$status = 200;
$response = array();
$error = "";

// Database connection
require '../db.inc.php';
$mysqli = new mysqli($mysqli_hostname, $mysqli_username, $mysqli_password, $mysqli_database, $mysqli_port);

switch ($_SERVER['REDIRECT_URL']) {
    // Hello world, test API
    case "/api/hello": {
        $response = array(
            hello => "Hello " . $_SERVER['REMOTE_ADDR'],
        );
        break;
    }

    // UPC lookup
    case "/api/lookup": {
        $stmt = $mysqli->prepare("SELECT `item_id`, `upc`, `name`, `life` FROM `items` WHERE upc=?");
        $stmt->bind_param("s", $_GET['code']);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();
        if ($row) {
            $response = array(
                upc => $_GET['code'],
                found => true,
                id => $row['item_id'],
                name => $row['name'],
            );
        } else {
            $response = array(
                upc => $_GET['code'],
                found => false,
            );
        }
        break;
    }

    default: {
        $status = "400";
        $error = "API not found";
    }
}

// If there was an error, create the response
if ($error) {
    $response = array(
        error => $error,
    );
}

// Output the response as JSON
http_response_code($status);
header("Content-Type: application/json");
print json_encode($response, JSON_PRETTY_PRINT);
?>