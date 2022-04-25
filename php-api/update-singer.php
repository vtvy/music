<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$singerId = $_GET['id'];
$singerName = $_GET['name'];
$query = "UPDATE singers SET singer_name = '$singerName' 
            WHERE singer_id = '$singerId';";


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
