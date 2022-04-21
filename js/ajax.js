function ajax(data, option, url, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function async() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(this.responseText);
        }
    };
    xmlHttp.open(option, url, true);
    xmlHttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
    );
    xmlHttp.send(data);
}

function signup(username, password) {
    let data = "username=" + username + "&password=" + password;

    ajax(data, "POST", "./php-api/signup.php", (res) => {
        console.log(res);
        res = JSON.parse(res);
        console.log(res);
    });
}
