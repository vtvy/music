function ajax(option, url, callback = () => {}, data) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function async() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            console.log(this.responseText);
            callback(JSON.parse(this.responseText));
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
            if (res.status) {
                location.href = "/";
            } else {
                alert("Some thing went wrong, please try again");
            }
        },
        data
    );
}

function login(username, password) {
    let data = "username=" + username + "&password=" + password;

    ajax("GET", `./php-api/login.php?${data}`, (res) => {
        if (res.status) {
            location.href = "/";
        } else {
            alert(res.message);
        }
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
        if (res.status) {
            let singer = document.createElement("option");
            singer.textContent = singerName;
            singer.value = selectSingers.lastElementChild.value++ || "1";
            selectSingers.add(singer);
            let aSinger = document.createElement("div");
            aSinger.classList.add("singer");
            aSinger.innerHTML = `
            <h4>${singerName}</h4>
            <div class='update-delete-icon flex' editFor='${lastIndex}' numberSong='0'>
                <h5>0 songs</h5>
            </div>
            `;
            singerList.appendChild(aSinger);
        } else {
            singerWarning.textContent = res.message;
        }
    });
}

function updateSinger(singerId, singerName, e, selectSingers) {
    singerId = parseInt(singerId);
    ajax(
        "GET",
        `../php-api/update-singer.php?id=${singerId}&name=${singerName}`,
        (res) => {
            if (res.status) {
                for (let i = 0; i < selectSingers.length; i++) {
                    if (selectSingers.options[i].value == singerId) {
                        console.log(selectSingers.options[i].innerHTML);
                        selectSingers.options[i].innerHTML = singerName;
                    }
                }
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
            if (res.status) {
                element.parentElement.outerHTML = "";
                let singerOption = document.getElementById("song-singer");
                for (let i = 0; i < singerOption.length; i++) {
                    if (singerOption.options[i].value === singerId)
                        singerOption.remove(i);
                }
            }
        }
    );
}

function updateSong(songId, newSongName, element) {
    ajax(
        "GET",
        `../php-api/update-song-name.php?id=${parseInt(
            songId
        )}&name=${newSongName}`,
        (res) => {
            if (res.status) {
                element.innerHTML = newSongName;
            } else {
                element.innerHTML = e.firstChild.attributes["oldValue"].value;
            }
        }
    );
}

function deleteSong(songId, element) {
    ajax("GET", `../php-api/delete-song.php?id=${parseInt(songId)}`);
}

function changePasswd(pass, newPass) {
    let data = "password=" + pass + "&newPassword=" + newPass;
    this.ajax(
        "POST",
        `./php-api/change.php`,
        (res) => {
            if (res.status) {
                location.href = "./login.php";
            } else {
                alert(res.message);
            }
        },
        data
    );
}
