<?php
    session_start();
    if (!isset($_SESSION['vmusic'])) {
        header('Location: ./login.php');
    }
    $page_title = "Change password";
    require_once "./templates/header.php";
?>
<div class="sign-form">
    <form class="form">
        <div class="title">Change password</div>
        <div class="subtitle">Enter your password</div>
        <div class="input-container">
            <input id="password" class="input" type="password" placeholder=" " required min="4" />
            <div class="cut"></div>
            <label for="password" class="placeholder">password</label>
        </div>
        <div id="pass-warning" class="warning"></div>
        <div class="input-container">
            <input id="new-password" class="input" type="password" placeholder=" " required />
            <div class="cut"></div>
            <label for="new-password" class="placeholder">new pw</label>
        </div>
        <div id="new-password-warning" class="warning"></div>
        <button type="text" class="submit-btn" id="change-submit-btn" type="submit">Change password</button>
        <div class="switch-form">If you want to return playlist <a href="./">click here!</a></div>
    </form>
</div>

<script src="./js/ajax.js"></script>
<script>
    document.getElementById("change-submit-btn").addEventListener("click", function validate(e) {
        e.preventDefault();
        document.getElementById("pass-warning").textContent = "";
        document.getElementById("new-password-warning").textContent = "";
        let password = document.getElementById("password").value.trim();
        let newPassword = document.getElementById("new-password").value.trim();
        if (password.length > 50 || password.length < 4 || (password && password.includes(newPassword))) {
            if (password.length > 50 || password.length < 4) {
                document.getElementById("pass-warning").textContent = "Password must be from 4 to 50 characters";
                document.getElementById("password").focus();
            }

            if ((password && password.includes(newPassword))) {
                document.getElementById("new-password-warning").textContent = "New password couldn't be same the old";
                document.getElementById("new-password").focus();
            }
        } else {
            changePasswd(password, newPassword);
        }

    });
</script>
<?php
    require_once './templates/footer.php'
?>