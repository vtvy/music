<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$singerId = $_GET['id'];
$query = "CALL del_singer($singerId);";

$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
        "message" => "some thing went wrong",
    ];
    echo json_encode($response);
} else {
    $row = $result->fetch_assoc();
    if ($row['del'] == 1) {
        $response = [
            "status" => true,
            "message" => "uppdated success",
        ];
        echo json_encode($response);
    } else {
        $response = [
            "status" => false,
            "message" => "some thing went wrong",
        ];
        echo json_encode($response);
    }
}
