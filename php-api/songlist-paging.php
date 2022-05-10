<?php
    header('Content-Type: application/json');

    $record_ppage = 11;
    require_once "../data/mysql-connection.php";

    // compute page number
    $query = "SELECT count(*) FROM songs;";
    $resultp = $conn->query($query);
    $rowp = $resultp->fetch_row();
    $p_total = ceil($rowp[0] / $record_ppage);
    $page = ($_GET["page"] <= $p_total && $_GET["page"] >= 1)?$_GET["page"]:1;
    $start = ($page - 1) * $record_ppage;

    // get songs in page
    $query = "SELECT s_id, s_name, s_path, s_img_path, singer_name 
        FROM songs s JOIN singers sg ON s.singer_id = sg.singer_id"
        . " LIMIT $start, $record_ppage;";

    $songs_result = $conn->query($query);

    if (!$songs_result || !$resultp) {
        $response = [
            "status" => false,
            "message" => "some thing went wrong"
        ];
        echo json_encode($response);
    } else {
        $data = array();
        while ($row = $songs_result->fetch_assoc()) {
            $data[] = array(
                "singerName" => $row["singer_name"],
                "name" => $row["s_name"],
                "path" => $row["s_path"],
                "image" => $row["s_img_path"],
                "songId" => $row["s_id"]
            );
        }

        $response = [
            "status" => true,
            "message" => "get songs success",
            "data" => $data
        ];
        echo json_encode($response);
    }
?>