<?php
require_once "../data/mysql-connection.php";


if (($_FILES['song-file']['error'] == 0) &&
    ($_FILES['song-file']['type'] == "audio/mpeg") &&
    ($_FILES["song-image"]["type"] == "image/jpeg") &&
    ($_FILES["song-image"]['error'] == 0)
) {
    $song = $_POST['song-name'];
    $singer_id = $_POST['singer-id'];
    $song_path = "./assets/music/" . time() . $_FILES["song-file"]["name"];
    $image_path = "./assets/images/" . time() . $_FILES["song-image"]["name"];

    $query = "INSERT INTO songs(singer_id, s_name, s_path, s_img_path) 
          VALUES" . "('$singer_id', '$song', '$song_path', '$image_path');";


    $result = $conn->query($query);

    if (!$result) {
        echo $conn->error;
    } else {
        move_uploaded_file(
            $_FILES["song-file"]["tmp_name"],
            "." . $song_path
        );
        move_uploaded_file(
            $_FILES["song-image"]["tmp_name"],
            "." . $image_path
        );
        header('Location: ../admin/index.php');
        exit();
    }
} else {
    echo "<h1>Upload song failed!</h1>";
}
