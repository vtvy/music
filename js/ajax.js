function ajax(option, url, callback, data) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function async() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(this.responseText);
        }
    };
    xmlHttp.open(option, url, true);
    if (option === "POST") {
        xmlHttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xmlHttp.send(data);
    } else {
        xmlHttp.send();
    }
}
function signup(username, password) {
    let data = "username=" + username + "&password=" + password;

    ajax(
        "POST",
        "./php-api/signup.php",
        (res) => {
            res = JSON.parse(res);
            console.log(res);
        },
        data
    );
}

function login(username, password) {
    let data = "username=" + username + "&password=" + password;

    ajax("GET", `./php-api/login.php?${data}`, (res) => {
        console.log(res);
        res = JSON.parse(res) || res;
        console.log(res);
    });
}
