function ajax(option, url, callback, data) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function async() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            callback(this.responseText);
        }
    };
    xmlHttp.open(option, url, true);
    if (option === "POST") {
        // xmlHttp.setRequestHeader(
        //     "Content-type",
        //     "application/x-www-form-urlencoded"
        // );
        console.log(data);
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
        res = JSON.parse(res);
        console.log(res);
    });
}

function addSinger(
    singerName,
    selectSingers,
    singerList,
    singerWarning,
    lastIndex
) {
    let data = "singer-name=" + singerName;
    lastIndex++;
    ajax("GET", `../php-api/add-singer.php?${data}`, (res) => {
        res = JSON.parse(res);
        if (res.status) {
            let singer = document.createElement("option");
            singer.textContent = singerName;
            singer.value = selectSingers.lastElementChild.value || "1";
            selectSingers.add(singer);
            let aSinger = document.createElement("div");
            aSinger.classList.add("singer");
            aSinger.innerHTML = `
            <h4>${singerName}</h4>
            <div class='update-delete-icon flex' editFor='-1' numberSong='-1'>
                <h5>0 songs</h5>
            </div>
            `;
            singerList.appendChild(aSinger);
        } else {
            singerWarning.textContent = "This singer is exist";
        }
    });
}

function updateSinger(singerId, singerName, e) {
    singerId = parseInt(singerId);
    ajax(
        "GET",
        `../php-api/update-singer.php?id=${singerId}&name=${singerName}`,
        (res) => {
            res = JSON.parse(res);
            if (res.status) {
                e.innerHTML = `${singerName}`;
            } else {
                location.href = "./";
            }
        }
    );
}

function deleteSinger(singerId, element) {
    ajax(
        "GET",
        `../php-api/delete-singer.php?id=${parseInt(singerId)}`,
        (res) => {
            res = JSON.parse(res);
            if (res.status) {
                element.parentElement.outerHTML = "";
                let singerOption = document.getElementById("song-singer");
                for (var i = 0; i < singerOption.length; i++) {
                    if (singerOption.options[i].value === singerId)
                        singerOption.remove(i);
                }
            }
        }
    );
}
