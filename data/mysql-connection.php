<?php
    $conn = mysqli_init();
    mysqli_real_connect($conn, 'mydemoserver.mysql.database.azure.com', 'test', 'test', 'vmusic', 3306);
    if (mysqli_connect_errno($conn)) {
    die('Failed to connect to MySQL: '.mysqli_connect_error());
    }
?>