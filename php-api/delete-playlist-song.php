<?php
    header('Content-Type: application/json');

    require_once "../data/mysql-connection.php";


    session_start();
    $uid = $_SESSION["vmusic"];

    $songId = $_GET['id'];
    $query = "CALL del_playlist_song" . "($songId, $uid);";

    $result = $conn->query($query);

    if (!$result) {
        $response = [
            "status" => false,
            "message" => "some thing went wrong, please try later",
        ];
        echo json_encode($response);
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
                "message" => "some thing went wrong, please try later",
            ];
            echo json_encode($response);
        }
    }
?>