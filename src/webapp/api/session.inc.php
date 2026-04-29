<?php
$apis[] = [
    # POST /session
    'pattern' => 'session',
    'methods' => ["POST"],
    'handler' => "api_login",
    'allow_anonymous' => true,
];

// Terminology:
// "password hash" one way hash (currently bcrypt 12) of the user's password with a random salt.
// See https://www.php.net/manual/en/ref.password.php
// "token key" a random 256-bit value for each user, used to encrypt and decrypt the bearer token.
// Generated on first login, and can be reset to invalidate all sessions.
// Stored as a hex string in the database to avoid encoding issues.
// "token" is the bearer token used for authentication
// Comprises the user ID, a random IV, and an encrypted string containing the time it was generated, client value, and user ID.

const TOKEN_KEY_LENGTH = 32; // 256 bits for AES-256
const TOKEN_IV_LENGTH = 16; // 128 bits for AES block size
const TOKEN_CIPHER_METHOD = 'aes-256-cbc';

function api_login($api, $method, $params, $data) {
    global $mysqli;

    $user = $data['email'] ?? "";
    $password = $data['password'] ?? "";
    $client = $data['client'] ?? "";

    // Check we have the basic data we need
    if (!$user || !$password) {
        return api_error("Invalid email or password");
    }

    // Get user record
    $stmt = $mysqli->prepare("SELECT `user_id`, `email`, `password_hash`, `token_key` FROM `users` WHERE `email`=?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    if ($mysqli->error) { return api_error($mysqli->error); }

    // Ensure we have a row
    $result = $stmt->get_result();
    if (!($row = $result->fetch_assoc())) {
        return api_error("Invalid email or password");
    }

    // Verify the password hashes to the stored hash
    if (!password_verify($password, $row['password_hash'])) {
        return api_error("Invalid email or password");
    }

    // If the password needs rehashing, do it and update the database
    if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
        $new_hash = password_hash($password, PASSWORD_DEFAULT);
        // Update the database with the new hash
        $stmt = $mysqli->prepare("UPDATE `users` SET `password_hash`=? WHERE `user_id`=?");
        $stmt->bind_param("si", $new_hash, $row['user_id']);
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }
    }

    // Password is correct, create a bearer token

    if($row['token_key'] && strlen($row['token_key']) == (TOKEN_KEY_LENGTH * 2)) {
        $token_key_hex = $row['token_key'];
        // Convert the hex token key back to binary
        $token_key = hex2bin($token_key_hex);
    } else {
        // Generate a random token key
        $token_key = random_bytes(TOKEN_KEY_LENGTH);
        $token_key_hex = bin2hex($token_key);

        // Store the token key in the database
        $stmt = $mysqli->prepare("UPDATE `users` SET `token_key`=? WHERE `user_id`=?");
        $stmt->bind_param("si", $token_key_hex, $row['user_id']);
        $stmt->execute();
        if ($mysqli->error) { return api_error($mysqli->error); }
    }

    // Create an encrypted token with the client value and time
    $token_contents = implode(':', [time(), $client, $row['user_id']]);
    $token_iv = random_bytes(TOKEN_IV_LENGTH);
    $token_crypt = openssl_encrypt($token_contents, TOKEN_CIPHER_METHOD, $token_key, 0, $token_iv);
    $token = implode(':', [$row['user_id'], bin2hex($token_iv), $token_crypt]);

    $response = [
        'user_id' => $row['user_id'],
        'token' => $token,
    ];

    return [
        'response' => $response,
    ];
}

function verify_session() {
    global $mysqli;

    // Get the bearer token from the Authorization header
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? "";
    if (!preg_match('/Bearer\s(\d+):([0-9a-f]{' . (TOKEN_IV_LENGTH * 2) . '}):([A-Za-z0-9\+\/=]+)/', $auth_header, $matches)) {
        return null;
    }

    // Get user record
    $user_id = $matches[1];
    $stmt = $mysqli->prepare("SELECT `user_id`, `token_key` FROM `users` WHERE `user_id`=?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    if ($mysqli->error) {
        return null;
    }

    // Ensure we have a row
    $result = $stmt->get_result();
    if (!($row = $result->fetch_assoc())) {
        return null;
    }

    if(!$row['token_key'] || strlen($row['token_key']) != (TOKEN_KEY_LENGTH * 2)) {
        return null;
    }

    $token_iv = hex2bin($matches[2]);
    $token_crypt = $matches[3];
    $token_key = hex2bin($row['token_key']);
    $token_contents = openssl_decrypt($token_crypt, TOKEN_CIPHER_METHOD, $token_key, 0, $token_iv);

    $token_parts = explode(':', $token_contents);
    if (count($token_parts) !== 3) {
        return null;
    }

    if ($token_parts[2] != $user_id) {
        return null;
    }

    return $user_id;
}
