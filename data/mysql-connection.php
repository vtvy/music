<?php
    require_once "sql_config.php";

    //create connection to mySQL
    $conn = @new mysqli($servername, $username, $password, $dbname)
        or die("Couldn't connect to the '$dbname' DB: " . $conn->connect_error);
?>