<?php
// Database configuration for Docker environment
// This file should be created from db.sample.inc.php before deployment

// Read from environment variables if available, fall back to defaults
$mysqli_hostname = getenv('DB_HOST') ?: 'localhost';
$mysqli_username = getenv('DB_USER') ?: 'fridgimon';
$mysqli_password = getenv('DB_PASSWORD') ?: 'hunter2';
$mysqli_database = getenv('DB_NAME') ?: 'fridgimon';
$mysqli_port = getenv('DB_PORT') ?: null;
