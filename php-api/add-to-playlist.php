<?php
    header('Content-Type: application/json');

    require_once "../data/mysql-connection.php";

    session_start();
    $uid = $_SESSION["vmusic"];
    $id = $_GET["id"];

    $add_query = "INSERT INTO playlists (s_id, uid) VALUES($id, $uid);";

    $add_result = $conn->query($add_query);

    $query = "SELECT s_id, s_name, s_path, s_img_path, singer_name 
        FROM songs s JOIN singers sg ON s.singer_id = sg.singer_id 
        WHERE s_id = $id;";


    $result = $conn->query($query);

    if (!$result || !$add_result) {
        $response = [
            "status" => false,
            "message" => "some thing went wrong"
        ];
        echo json_encode($response);
    } else {
        $row = $result->fetch_assoc();
        $data = [
            "singerName" => $row["singer_name"],
            "name" => $row["s_name"],
            "path" => $row["s_path"],
            "image" => $row["s_img_path"],
            "songId" => $row["s_id"]
        ];

        $response = [
            "status" => true,
            "message" => "get songs success",
            "data" => $data
        ];
        echo json_encode($response);
    }
?>