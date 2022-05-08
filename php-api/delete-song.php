<?php
    header('Content-Type: application/json');

    require_once "../data/mysql-connection.php";


    session_start();
    $uid = $_SESSION["vmusic"];
    if($uid != 1) {
        unset($_SESSION['vmusic']);
        header('Location: ../');
    }

    $songId = $_GET['id'];
    $query = "CALL del_song($songId);";

    $result = $conn->query($query);

    if (!$result) {
        $response = [
            "status" => false,
            "message" => "some thing went wrong",
        ];

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
?>