<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$songId = $_GET['id'];
$songName = $_GET['name'];
$query = "UPDATE songs SET s_name = '$songName' 
            WHERE s_id = '$songId';";


$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
        "message" => "some thing went wrong",
    ];
    echo json_encode($response);
} else {
    $response = [
        "status" => true,
        "message" => "uppdated success",
    ];
    echo json_encode($response);
}
