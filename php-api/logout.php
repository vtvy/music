<?php
session_start();
if (isset($_SESSION['vmusic'])) {
    unset($_SESSION['vmusic']);
    $response = [
        "status" => true,
    ];
    echo json_encode($response);
}else{
    $response = [
        "status" => false,
        "message" => "Something went wrong, please try again"
    ];
    echo json_encode($response);
}
