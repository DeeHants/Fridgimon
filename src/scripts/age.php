#!/usr/bin/php
<?php
$dryrun = false;

// Database connection
require dirname($_SERVER['PHP_SELF']) . '/../webapp/db.inc.php';
$mysqli = new mysqli($mysqli_hostname, $mysqli_username, $mysqli_password, $mysqli_database, $mysqli_port);

// Lookup the items
$item_stmt = $mysqli->prepare("SELECT `item_id`, `code`, `name`, `variant`, `life`, `ages` FROM `items` WHERE not isnull(`life`) ORDER BY `name`");
$item_stmt->execute();
if ($mysqli->error) { die($mysqli->error); }
$item_result = $item_stmt->get_result();

while($item = $item_result->fetch_assoc()) {
    // and contents
    $content_stmt = $mysqli->prepare("SELECT `content_id`, `added`, `expiry` FROM `contents` WHERE `item_id` = ? and (not `age_checked` or ?) ORDER BY `added`");
    $content_stmt->bind_param("ii",
        ...array( # Hack to get a reference
            $item['item_id'],
            $dryrun ? 1 : 0,
        )
    );
    $content_stmt->execute();
    if ($mysqli->error) { die($mysqli->error); }
    $content_result = $content_stmt->get_result();

    // Get the ages of the past contents
    $ages = $item['ages'] ? explode(",", $item['ages']) : array();

    // And now any current (an unchecked) items
    while($content = $content_result->fetch_assoc()) {
        // Not interested if there is no expiry
        if (!$content['expiry']) { continue; }

        // Calculate the dates and differences
        $added_date = new DateTime($content['added']);
        $expiry_date = new DateTime($content['expiry']);
        $interval = $added_date->diff($expiry_date);
        $age = $interval->days * ($interval->invert ? -1 : 1);

        // Update the average
        $item_count++;
        $total_age += $age;
        $ages[] = $age;

        // print implode(" ", array(
        //     "    ",
        //     $content['added'],
        //     $content['expiry'],
        //     $age,
        // )) . "\n";

        // Update the content record
        if ($dryrun) {
            print "UPDATE `contents` SET `age_checked` = 1 WHERE `content_id` = " . $content['content_id'] . ";\n";
        } else {
            $content_update_stmt = $mysqli->prepare("UPDATE `contents` SET `age_checked` = 1 WHERE `content_id` = ?");
            $content_update_stmt->bind_param("i",
                $content['content_id']
            );
            $content_update_stmt->execute();
            if ($mysqli->error) { die($mysqli->error); }
        }
    }

    // We're looking for an average so calculate it based on all items
    $item_count = count($ages);
    $total_age = array_sum($ages);

    // If there were no items, we're not interested
    if ($item_count == 0) { continue; }
    $average_age = $total_age / $item_count;

    if (abs($average_age - $item['life']) > 1) {
        print implode(" ", array(
            $item['item_id'],
            $item['code'],
            "\t",
            $item['name'],
            $item['variant'] ? "(" . $item['variant'] . ")" : "",
            "\t",
            "\"" . $item['life'] . "\"",
            "\"" . $average_age . "\"",
            "\"" . implode(",", $ages) . "\"",
        )) . "\n";
    }

    // Update the age list
    if ($dryrun) {
        print "UPDATE `items` SET `life` = " . round($average_age) . ", `ages` = \"" . implode(",", $ages) . "\" WHERE `item_id` = " . $item['item_id'] . ";\n";
    } else {
        $item_update_stmt = $mysqli->prepare("UPDATE `items` SET `life` = ?, `ages` = ? WHERE `item_id` = ?");
        $item_update_stmt->bind_param("isi",
            ...array( # Hack to get a reference
                round($average_age),
                implode(",", $ages),
                $item['item_id'],
            )
        );
        $item_update_stmt->execute();
        if ($mysqli->error) { die($mysqli->error); }
    }
}
