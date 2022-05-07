<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";
session_start();
$uid = $_SESSION["vmusic"];
$uid = (int)$uid;


$pw = $_POST['password'];
$new_pw = $_POST['newPassword'];
$query = "CALL changePw($uid, '$pw', '$new_pw')";

$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row["res"] != 0) {
        $response = [
            "status" => true,
            "message" => "password change successfully"
        ];
        echo json_encode($response);
    } else {
        $response = [
            "status" => false,
            "message" => "password is incorect"
        ];
        echo json_encode($response);
    }
} else {
    echo $conn->error;
    // $response = [
    //     "status" => false,
    //     "message" => "some thing went wrong"
    // ];
    // echo json_encode($response);
}
