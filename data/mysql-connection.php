<?php
    $host       = "vmusic-server.mysql.database.azure.com";
    $username   = "vmusic";
    $password   = "Vdata123";
    $dbname     = "vmusic";
    $ca         = "../data/DigiCertGlobalRootCA.crt.pem";

    $conn = mysqli_init();
    mysqli_ssl_set($conn,NULL,NULL,$ca , NULL, NULL);
    mysqli_real_connect($conn, $host, $username, $password, $dbname, 3306, MYSQLI_CLIENT_SSL);
?>