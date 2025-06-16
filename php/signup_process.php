<?php



header("Content-Type: application/json"); 

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


require 'db_connect.php'; 


$data = json_decode(file_get_contents("php://input"));

if (
    !isset($data->email) || empty(trim($data->email)) ||
    !isset($data->password) || empty(trim($data->password)) ||
    !isset($data->confirm_password) || empty(trim($data->confirm_password))
) {
    http_response_code(400); 
    echo json_encode(["error" => "All fields (Email, Password, Confirm Password) are required."]);
    exit; 
}

$email = trim($data->email);
$password = trim($data->password);
$confirm_password = trim($data->confirm_password);

// Validate Email Format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email format."]);
    exit;
}

// Check if Passwords Match:
if ($password !== $confirm_password) {
    http_response_code(400);
    echo json_encode(["error" => "Passwords do not match."]);
    exit;
}

// Password Strength Check 
if (strlen($password) < 6) { 
    http_response_code(400);
    echo json_encode(["error" => "Password must be at least 6 characters long."]);
    exit;
}


$password_hash = password_hash($password, PASSWORD_BCRYPT); 


$sql_check_email = "SELECT id FROM users WHERE email = ?"; 
$stmt_check = $conn->prepare($sql_check_email);

if (!$stmt_check) { 
    http_response_code(500);
    
    echo json_encode(["error" => "Server error during email check. Please try again."]);
    exit;
}

$stmt_check->bind_param("s", $email); 
$stmt_check->execute(); 
$stmt_check->store_result(); 
if ($stmt_check->num_rows > 0) { 
    http_response_code(409);
    echo json_encode(["error" => "This email address is already registered."]);
    $stmt_check->close(); 
    $conn->close();       
    exit;
}
$stmt_check->close(); 


// Insert New User into Database
$sql_insert_user = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
$stmt_insert = $conn->prepare($sql_insert_user);

if (!$stmt_insert) { 
    http_response_code(500);
   
    echo json_encode(["error" => "Server error while creating account. Please try again."]);
    exit;
}

$stmt_insert->bind_param("ss", $email, $password_hash); 

if ($stmt_insert->execute()) {
    http_response_code(201); 
    echo json_encode([
        "message" => "Signup successful! You can now login.",
        "userId" => $stmt_insert->insert_id 
    ]);
} else { 
    http_response_code(500);
   
    echo json_encode(["error" => "Failed to register your account. Please try again."]);
}


$stmt_insert->close();
$conn->close();
?>