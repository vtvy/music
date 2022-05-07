<?php
session_start();
if (isset($_SESSION['vmusic'])) {
    header('Location: ./');
}
$page_title = "Login";
$css = "./assets/css/main";
require_once "./templates/header.php";
?>
<div class="sign-form">
    <form class="form">
        <header class="title">Login</header>
        <div class="subtitle">Enter your account</div>
        <div class="input-container">
            <input id="username" class="input" type="text" placeholder=" " required min="4" />
            <div class="cut"></div>
            <label for="username" class="placeholder">username</label>
        </div>
        <div id="user-warning" class="warning"></div>
        <div class="input-container">
            <input id="password" class="input" type="password" placeholder=" " required />
            <div class="cut"></div>
            <label for="password" class="placeholder">password</label>
        </div>
        <div id="pass-warning" class="warning"></div>
        <button type="submit" id="login-submit-btn" class="submit-btn">Login</button>
        <div class="switch-form">If you don't have an account <a href="./signup.php">click here!</a></div>
    </form>
</div>
<script src="./js/ajax.js?v=<?php echo time(); ?>"></script>
<script>
    document.getElementById("login-submit-btn").addEventListener("click", function validate(e) {
        e.preventDefault();
        document.getElementById("user-warning").textContent = "";
        document.getElementById("pass-warning").textContent = "";
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value.trim();
        if (username.length > 30 || username.length < 4 || password.length > 50 || password.length < 4 || (password && password.includes(username))) {
            if (username.length > 30 || username.length < 4) {
                document.getElementById("user-warning").textContent = "Username must be from 4 to 30 characters"
                document.getElementById("username").focus();

            }
            if (password.length > 50 || password.length < 4) {
                document.getElementById("pass-warning").textContent = "Password must be from 4 to 50 characters"
                document.getElementById("password").focus();
            }

            if ((password && password.includes(username))) {
                document.getElementById("pass-warning").textContent = "Password couldn't contain username"
                document.getElementById("password").focus();
            }
        } else {
            login(username, password);
        }

    });
</script>
<?php
require_once './templates/footer.php'
?>