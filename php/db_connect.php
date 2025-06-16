<?php


// Database connection details
$servername = "localhost";       
$username = "root";               
$password = "";                   
$dbname = "form";          

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
   
    http_response_code(500); // Internal Server Error
    die(json_encode(["error" => "Database connection error. Please try again later."]));
}

$conn->set_charset("utf8mb4"); 
?>