<?php
// File: PromoWeb/php/db_connect.php (Using Environment Variables)

define('DB_SERVERNAME', 'fdb1028.awardspace.net'); // Aapka AwardSpace Hostname
define('DB_USERNAME', '4647435_usmanpromo');    // Aapka AwardSpace DB Username
define('DB_PASSWORD', 'Usman123@');             // Aapka AwardSpace DB Password
define('DB_NAME', '4647435_form');  

if (!$servername || !$username || !$dbname) { // Password can be empty
    http_response_code(500);
    // error_log("Database environment variables not set.");
    die(json_encode(["error" => "Database configuration error."]));
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    // error_log("DB Connection Error using Env Vars: " . $conn->connect_error);
    die(json_encode(["error" => "Database connection error. Please try again later."]));
}

$conn->set_charset("utf8mb4");
?>
