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
                item_id => $row['item_id'],
                name => $row['name'],
                expires => $row['life'] != "",
                life => $row['life'],
            );
        } else {
            $response = array(
                upc => $_GET['code'],
                found => false,
            );
        }
        break;
    }

    case "/api/contents": {
        if ($_GET['upc']) {
            $stmt = $mysqli->prepare("SELECT `content_id`, `upc`, `contents`.`item_id`, `name`, `container_id` as `container`, `added`, `expiry` FROM `contents` LEFT JOIN `items` ON `contents`.`item_id` = `items`.`item_id` WHERE `upc`=?");
            $stmt->bind_param("s", $_GET['upc']);
        } else {
            $stmt = $mysqli->prepare("SELECT `content_id`, `upc`, `contents`.`item_id`, `name`, `container_id` as `container`, `added`, `expiry` FROM `contents` LEFT JOIN `items` ON `contents`.`item_id` = `items`.`item_id`");
        }
        // die($mysqli->error);
        $stmt->execute();
        $result = $stmt->get_result();

        while($row = $result->fetch_assoc()) {
            if ($row['expiry'] != '') {
                $expiry_date = new DateTime($row['expiry']);
                $current_date = new DateTime();
                $interval = $current_date->diff($expiry_date, false);
                $days_left = $interval->d * ($interval->invert ? -1 : 1);
                $row['days_left'] = $days_left;
                $row['expired'] = $days_left < 0;
            }
            $response[] = $row;
        }
        break;
    }

    case "/api/store": {
        $stmt = $mysqli->prepare("INSERT INTO `contents` (`item_id`, `container_id`, `expiry`) VALUES (?, 1, ?)");
        $stmt->bind_param("is",
            $_GET['item_id'],
            $_GET['expiry']
        );
        $stmt->execute();
        break;
    }

    case "/api/register": {
        $stmt = $mysqli->prepare("INSERT INTO `items` (`upc`, `name`, `life`) VALUES (?, ?, 1)");
        $stmt->bind_param("ss",
            $_GET['upc'],
            $_GET['name']
        );
        $stmt->execute();

        $id = $mysqli->insert_id;
        // Get the new record
        $stmt = $mysqli->prepare("SELECT `item_id`, `upc`, `name`, `life` FROM `items` WHERE item_id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $response =  $result->fetch_assoc();
        $response['found'] = true;
        $response['expires'] = $response['life'] != "";
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