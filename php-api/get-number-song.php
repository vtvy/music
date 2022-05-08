<?php
    header('Content-Type: application/json');

    require_once "../data/mysql-connection.php";

    $singerId = $_GET['id'];
    $query = "SELECT COUNT(singer_id) FROM songs WHERE songs.singer_id = '$singerId';";


    $result = $conn->query($query);

    if (!$result) {
        echo '0';
    } else {
        $row = $result->fetch_assoc();
        echo $row['COUNT(singer_id)'];
    }
?>