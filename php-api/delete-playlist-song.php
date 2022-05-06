<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$songId = $_GET['id'];
$query = "CALL del_playlist_song($songId, 1);";

$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
        "message" => "some thing went wrong",
    ];
    // echo json_encode($response);
    echo $conn->error;
} else {
    $row = $result->fetch_assoc();
    if ($row['del'] == 1) {
        $response = [
            "status" => true,
            "message" => "delete success",
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
