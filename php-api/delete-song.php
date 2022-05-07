<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$songId = $_GET['id'];
$query = "CALL del_song($songId);";

$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
        "message" => "some thing went wrong",
    ];

    echo $conn->error;
    echo json_encode($response);
} else {
    $row = $result->fetch_assoc();
    if ($row['del'] == 1) {
        unlink('.' . $row['s_path']);
        unlink('.' . $row['s_img_path']);
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
