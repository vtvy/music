<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$username = $_GET['username'];
$password = $_GET['password'];
$query = "SELECT uid, username, passwd FROM users 
            WHERE username = '$username' AND passwd = '$password';";


$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
        "message" => "some thing went wrong",
    ];
    echo json_encode($response);
} else {
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        session_start();
        $_SESSION['vmusic'] = $row["uid"];
        $response = [
            "status" => true,
            "message" => "login success",
        ];
        echo json_encode($response);
    } else {
        $response = [
            "status" => false,
            "message" => "username or password is incored",
        ];
        echo json_encode($response);
    }
}
