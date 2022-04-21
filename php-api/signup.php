<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$username = $_POST['username'];
$password = $_POST['password'];
$query = "INSERT INTO users(username, passwd) VALUES" . "('$username','$password');";


if (!$conn->query($query)) {
    $response = [
        "status" => false,
        "message" => "username or password is invalid"
    ];
    echo $conn->error;
} else {
    $response = [
        "status" => true,
        "message" => "account created successfully"
    ];

    echo json_encode($response);
}
