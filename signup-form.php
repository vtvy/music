<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign up</title>
    <link rel="shortcut icon" href="https://res.cloudinary.com/web-upload/image/upload/v1646980665/favicon_kobqjp.ico" type="image/x-icon" />
    <link rel="stylesheet" href="./assets/css/sign-up.css?v=<?php echo time() ?>">
</head>

<body>
    <div class="form">
        <div class="title">Sign up</div>
        <div class="subtitle">Create your account</div>
        <div class="input-container">
            <input id="username" class="input" type="text" placeholder=" " required min="4" />
            <div class="cut"></div>
            <label for="username" class="placeholder">username</label>
        </div>
        <div id="user-warning"></div>
        <div class="input-container">
            <input id="password" class="input" type="password" placeholder=" " required />
            <div class="cut"></div>
            <label for="password" class="placeholder">password</label>
        </div>
        <div id="pass-warning"></div>
        <button type="text" class="submit" type="submit" onclick="validate();">Sign Up</button>
    </div>
    <script src="./js/ajax.js"></script>
    <script>
        function validate() {
            document.getElementById("user-warning").textContent = "";
            document.getElementById("pass-warning").textContent = "";
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            if (username.length > 30 || username.length < 4 || password.length > 50 || password.length < 4 || password.includes(username)) {
                if (username.length > 30 || username.length < 4) {
                    document.getElementById("user-warning").textContent = "Username must be from 4 to 30 characters"

                }
                if (password.length > 50 || password.length < 4) {
                    document.getElementById("pass-warning").textContent = "Password must be from 4 to 50 characters"
                }

                if (password.includes(username)) {
                    document.getElementById("pass-warning").textContent = "Password couldn't contain username"
                }
            } else {
                signup(username, password);
            }

        }
    </script>
</body>

</html>