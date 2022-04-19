<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP</title>
</head>

<body>
    <form action="mysql.php" method="post">
        <input type="text" name="name">
        <input type="password" name="pwd">
        <button type="submit">Nộp</button>
    </form>

    <h3>
        <?php
        if (isset($_POST["name"]) && isset($_POST["pwd"])) {
            if ($_POST["pwd"] == "abc") {
                echo "Welcome " . $_POST["name"];
            }else{
                echo "Sorry ". $_POST["name"] . ", wrong password";
            }
        }else{
            echo "<span style=\"color: red;\">" . "<i>name</i> and <i>password</i> are expected";
        }
        // require_once 'connection.php';
        // //create connection
        // $conn = @new mysqli($servername, $username, $password);
        // //check connection
        // if ($conn->connect_error) {
        // die("Connection failed: " . $conn->connect_error);
        // } 
        // echo "Connected successfully";
        ?>
    </h3>

</body>

</html>