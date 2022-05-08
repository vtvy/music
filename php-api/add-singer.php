<?php
    header('Content-Type: application/json');
    require_once "../data/mysql-connection.php";


    $singer = $_GET['singer-name'];
    $query = "INSERT INTO singers(singer_name) VALUES" . "('$singer');";


    $result = $conn->query($query);

    if (!$result) {
        $response = [
            "status" => false,
            "message" => "singer name is exist",
        ];
        echo json_encode($response);
    } else {
        $response = [
            "status" => true,
        ];
        echo json_encode($response);
    }
?>