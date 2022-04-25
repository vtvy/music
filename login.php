<?php
$page_title = "Login";
$css = "./assets/css/sign";
require_once "./templates/header.php";
?>
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
    <button type="text" id="login-submit-btn">Login</button>
</form>
<script src="./js/ajax.js?v=<?php echo time(); ?>"></script>
<script>
    document.getElementById("login-submit-btn").addEventListener("click", function validate(e) {
        e.preventDefault();
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
            login(username, password);
        }

    });
</script>
<?php
require_once './templates/footer.php'
?>