<?php
header('Content-Type: application/json');

require_once "../data/mysql-connection.php";


$keyword = $_GET['kw'];
$new_kw = str_replace(" ", "%' OR s_name LIKE '%", $keyword);
$query = "SELECT s_id, s_name, s_img_path, singer_name 
    FROM songs s JOIN singers sg ON s.singer_id = sg.singer_id 
    WHERE s_name LIKE '%$keyword%' OR s_name LIKE '%$new_kw%' LIMIT 5;";


$result = $conn->query($query);

if (!$result) {
    $response = [
        "status" => false,
    ];
    echo json_encode($response);
} else {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = array(
            "singerName" => $row["singer_name"],
            "name" => $row["s_name"],
            "image" => $row["s_img_path"],
            "songId" => $row["s_id"]
        );
    }
    $response = [
        "status" => true,
        "data" => $data
    ];
    echo json_encode($response);
}
