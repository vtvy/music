<?php
    header('Content-Type: application/json');
    require_once "../data/mysql-connection.php";


    $username = $_POST['username'];
    $password = $_POST['password'];
    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);
    $query = "CALL signup('$username','$password');";

    $result = $conn->query($query);
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row["res"] != 0) {
            setcookie("vname", $username, time() + 60, "/music");
            session_start();
            $_SESSION['vmusic'] = $row["res"];
            $response = [
                "status" => true,
                "message" => "account created successfully"
            ];

            echo json_encode($response);
        } else {
            $response = [
                "status" => false,
                "message" => "username or password is invalid"
            ];
            echo json_encode($response);
        }
    } else {
        $response = [
            "status" => false,
            "message" => "username or password is invalid"
        ];
        echo json_encode($response);
    }
?>