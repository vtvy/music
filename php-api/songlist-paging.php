<?php
    header('Content-Type: application/json');

    $record_ppage = 11;
    require_once "../data/mysql-connection.php";

    // compute page number
    $query = "SELECT count(*) FROM songs;";
    $result = $conn->query($query);
    $row = $result->fetch_row();
    $p_total = ceil($row[0] / $record_ppage);
    $page = $_GET["page"];
    $start = ($page - 1) * $record_ppage;

    // get songs in page
    $query = "SELECT s_id, s_name, s_path, s_img_path, singer_name 
        FROM songs s JOIN singers sg ON s.singer_id = sg.singer_id"
        . " LIMIT $start, $record_ppage;";

    $songs_result = $conn->query($query);

    if (!$songs_result) {
        $response = [
            "status" => false,
            "message" => "some thing went wrong"
        ];
        echo json_encode($response);
    } else {
        $data = array();
        while ($row2 = $songs_result->fetch_assoc()) {
            $data[] = array(
                "singerName" => $row2["singer_name"],
                "name" => $row2["s_name"],
                "path" => $row2["s_path"],
                "image" => $row2["s_img_path"],
                "songId" => $row2["s_id"]
            );
        }
        $response = [
            "status" => true,
            "data" => $data,
            "pageTotal" => $p_total
        ];
        echo json_encode($response);
    }
?>