const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $("#playlist");
const searchBar = $("#search-bar");
const searchInput = $("#search-input");
const removeInput = $("#remove-kw-search");
const searchBtn = $("#search-btn");
const suggestList = $("#suggest-list");
const dashboard = $("#dashboard");
const repeatBtn = $("#repeat-btn");
const prevBtn = $("#prev-btn");
const playBtn = $("#play-button");
const nextBtn = $("#next-btn");
const randomBtn = $("#random-btn");
const currentSong = $("#current-song");
const currentTime = $("#current-time");
const timeBar = $("#time-bar");
const durationTime = $("#duration-time");
const volumeBtn = $("#volume-btn");
const volumeSlider = $("#volume-slider");
const showPlayListBtn = $("#show-playlist");
const playListContainer = $("#playlist-container");
const allSongList = $("#all-song-list");

const vmusic = {
    playing: false,
    settings: JSON.parse(localStorage.getItem("settings")) || {},

    setUserSettings: function (key, value) {
        this.settings[key] = value;
        localStorage.setItem("settings", JSON.stringify(this.settings));
    },

    songs: [],

    allSongs: [],

    ajax: function (url, callback = () => {}) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function async() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        };

        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    },

    // Show list of music
    showPlayList: function () {
        const List = this.songs.map((song, index) => {
            return `
                <div song-index="${index}" class="space-between song ${
                index === this.settings.currentSongIndex ? "playing-song" : ""
            }">
                    <div class="flex">
                        <div class="song-image" style="background-image: url('${
                            song.image
                        }')"></div>
                        <div class="music-infor">
                            <div  class="music-name">${song.name}</div>
                            <div class="singer-name">${song.singerName}</div>
                        </div>
                    </div>
                    <button class="btn warning del"><i class='fa-solid fa-trash'></i></button>
                </div>
            `;
        });

        playList.innerHTML = List.join("");
    },

    showAllSongs: function (page = 1) {
        this.ajax(`./php-api/songlist-paging.php?page=${page}`, (res) => {
            this.allSongs = res.data;
            var List = this.allSongs.map((song, index) => {
                return `
                <div song-id="${song.songId}" class="space-between song">
                    <div class="flex">
                        <div class="song-image" style="background-image: url('${
                            song.image
                        }')"></div>
                        <div class="music-infor">
                            <div class="music-name">${song.name}</div>
                            <div class="singer-name">${song.singerName}</div>
                        </div>
                    </div>
                    ${
                        this.songs.some((s) => s.songId === song.songId)
                            ? ""
                            : '<button class="btn add"><i class="fa-solid fa-heart"></i></button>'
                    }
                </div>
            `;
            });

            var songListElement = List.join("");
            if (res.pageTotal > 1) {
                let pages = Array(res.pageTotal)
                    .fill("")
                    .map((dot, index) => {
                        let pageNumber = index + 1;
                        if (index != page - 1) {
                            let distance = 0.75 + 2 * parseInt(index);
                            distance += "rem";
                            return `<input id="dot-${pageNumber}" 
                            onInput='{
                                document.getElementById("pacman").style.transform = "translateX(${distance})"}
                                setTimeout(() => {
                                    vmusic.showAllSongs(this.value);
                                }, 500);
                                 ' value=${pageNumber} type="radio" name="dots">
                                    <label title="page ${pageNumber}" for="dot-${pageNumber}"></label>
                                    `;
                        } else {
                            return `<input id="dot-${pageNumber}" value=${pageNumber} type="radio" name="dots" checked="checked">
                                    <label title="page ${pageNumber}" for="dot-${pageNumber}"></label>
                                    `;
                        }
                    });
                pages = pages.join("");
                let distance = 0.75 + 2 * parseInt(page - 1);
                distance += "rem";
                let pagination = `<div id="pagination">	
                    ${pages}
                       <div id="pacman" style='transform: translateX(${distance})'></div>
                       </div>`;
                songListElement = songListElement.concat(pagination);
            }
            allSongList.innerHTML = songListElement;
        });
    },

    loadSettings: function () {
        if (
            typeof this.settings.currentSongIndex !== "number" ||
            isNaN(this.settings.currentSongIndex) ||
            this.settings.currentSongIndex > this.songs.length - 1
        ) {
            this.setUserSettings("currentSongIndex", 0);
        }

        if (!(this.settings.volume >= 0 && this.settings.volume <= 1)) {
            this.setUserSettings("volume", 1);
        }

        if (typeof this.settings.mute !== "boolean") {
            this.setUserSettings("mute", false);
        }

        if (typeof this.settings.random !== "boolean") {
            this.setUserSettings("ramdom", false);
        }

        if (typeof this.settings.repeating !== "boolean") {
            this.setUserSettings("repeating", false);
        }

        if (
            typeof this.settings.time !== "number" ||
            this.settings.time < 0 ||
            this.settings.time > 100
        ) {
            this.setUserSettings("time", 0);
        }

        if (this.settings.mute) {
            // Set the default UI for user settings
            $("#on-volume").classList.toggle("show", !this.settings.mute);
            $("#mute-volume").classList.toggle("show", this.settings.mute);
            volumeSlider.value = 0;
            currentSong.muted = true;
            volumeSlider.style.background = this.setColor(0);
        } else {
            volumeSlider.value = this.settings.volume * 100;
            volumeSlider.style.background = this.setColor(volumeSlider.value);
            currentSong.volume = this.settings.volume;
        }

        if (currentSong.duration) {
        }

        if (this.settings.repeating) {
            repeatBtn.classList.toggle("active", this.settings.repeating);
        }

        if (this.settings.random) {
            randomBtn.classList.toggle("active", this.settings.random);
        }
    },

    // load settings for last time playing song
    loadLastTimePlaying: function () {
        setTimeout(() => {
            var duration;
            duration = currentSong.duration;
            if (duration) {
                timeBar.style.background = this.setColor(this.settings.time);
                currentSong.currentTime =
                    (currentSong.duration / 100) * this.settings.time;
            }
        }, 100);
    },

    setSong: function () {
        Object.defineProperty(this, "dashboardSong", {
            get: function () {
                return this.songs[this.settings.currentSongIndex];
            },
        });
    },

    setColor: function (percent) {
        return `linear-gradient(90deg, var(--main-color) ${percent}%, var(--secondary-color) ${percent}%)`;
    },

    convertTime: function (time) {
        let minute = Math.floor(time / 60);
        if (minute < 10) {
            minute = "0" + String(minute);
        }
        var seccond = Math.floor(time % 60);
        if (seccond < 10) {
            seccond = "0" + String(seccond);
        }

        return minute + ":" + seccond;
    },

    loadSong: function () {
        $("#db-music-name").textContent = this.dashboardSong.name;
        $("#db-singer-name").textContent = this.dashboardSong.singerName;
        $(
            ".dashboard-cd"
        ).style.backgroundImage = `url('${this.dashboardSong.image}')`;
        currentSong.src = this.dashboardSong.path;
        this.setUserSettings(
            "currentSongIndex",
            this.settings.currentSongIndex
        );

        setTimeout(() => {
            if (currentSong.duration) {
                durationTime.textContent = this.convertTime(
                    currentSong.duration
                );
            }
        }, 3000);

        setTimeout(() => {
            if (!playListContainer.classList.contains("hide-element")) {
                $("#playlist .song.playing-song").classList.remove(
                    "playing-song"
                );
                $(
                    `#playlist .song[song-index="${this.settings.currentSongIndex}"]`
                ).classList.add("playing-song");
                this.scrollIntoView();
            }
        }, 200);
    },

    prevSong: function () {
        if (this.settings.currentSongIndex === 0) {
            this.settings.currentSongIndex = this.songs.length - 1;
        } else {
            this.settings.currentSongIndex--;
        }
        this.loadSong();
    },

    nextSong: function () {
        if (this.settings.currentSongIndex === this.songs.length - 1) {
            this.settings.currentSongIndex = 0;
        } else {
            this.settings.currentSongIndex++;
        }
        this.loadSong();
    },

    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.settings.currentSongIndex);
        this.setUserSettings("currentSongIndex", newIndex);
        this.loadSong();
    },

    muteSong: function () {
        this.settings.mute = !this.settings.mute;
        this.setUserSettings("mute", this.settings.mute);
        volumeBtn.classList.toggle("mute", this.settings.mute);
        if (this.settings.mute) {
            volumeSlider.value = 0;
            currentSong.muted = true;
            volumeSlider.style.background = this.setColor(0);
        } else {
            volumeSlider.value =
                this.settings.volume === 0 ? 50 : this.settings.volume * 100;
            currentSong.muted = false;
            currentSong.volume = volumeSlider.value / 100;
            this.setUserSettings("volume", currentSong.volume);
            volumeSlider.style.background = this.setColor(volumeSlider.value);
        }
    },

    scrollIntoView: function () {
        $(
            `#playlist .song[song-index="${this.settings.currentSongIndex}"]`
        ).scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    },

    addNewSong: function (songId) {
        this.ajax(`./php-api/add-to-playlist.php?id=${songId}`, (res) => {
            const thisSong = res.data;
            this.songs.push(thisSong);
            const notShowDashboard =
                dashboard.classList.contains("hide-element");
            const isShowPlayList =
                !playListContainer.classList.contains("hide-element");
            setTimeout(() => {
                if (isShowPlayList) {
                    this.showPlayList();
                }
                if (notShowDashboard) {
                    this.setSong();
                    this.loadSong();
                    dashboard.classList.remove("hide-element");
                }
            }, 100);
        });
    },

    // Listening and handling function declare
    handleEvents: function () {
        const thisMusic = this;
        const cdRotate = cd.animate([{ transform: "rotate(360deg)" }], {
            duration: 50000,
            iterations: Infinity,
        });
        cdRotate.pause();

        repeatBtn.onclick = () => {
            thisMusic.settings.repeating = !thisMusic.settings.repeating;
            thisMusic.setUserSettings(
                "repeating",
                thisMusic.settings.repeating
            );
            repeatBtn.classList.toggle("active", thisMusic.settings.repeating);
        };

        prevBtn.onclick = () => {
            if (thisMusic.settings.random) {
                thisMusic.randomSong();
            } else {
                thisMusic.prevSong();
            }
            currentSong.play();
        };

        // When click on play button
        playBtn.onclick = () => {
            thisMusic.playing;
            if (thisMusic.playing) {
                currentSong.pause();
            } else {
                currentSong.play();
            }
        };

        nextBtn.onclick = () => {
            if (thisMusic.settings.random) {
                thisMusic.randomSong();
            } else {
                thisMusic.nextSong();
            }
            currentSong.play();
        };

        randomBtn.onclick = () => {
            thisMusic.settings.random = !thisMusic.settings.random;
            thisMusic.setUserSettings("random", thisMusic.settings.random);
            randomBtn.classList.toggle("active", thisMusic.settings.random);
        };

        volumeBtn.onclick = (e) => {
            if (e.target.tagName === "I") {
                thisMusic.muteSong();
            }
        };

        currentSong.onplay = () => {
            thisMusic.playing = true;
            playBtn.classList.add("playing");
            cdRotate.play();
        };

        currentSong.onpause = () => {
            thisMusic.playing = false;
            playBtn.classList.remove("playing");
            cdRotate.pause();
        };

        // Set the time bar
        currentSong.ontimeupdate = () => {
            const duration = currentSong.duration;
            if (duration) {
                const currentSongTime = currentSong.currentTime;
                const percent = (currentSongTime / duration) * 100;
                const each1Pecent = parseInt(percent * 10) % 10 == 0;
                if (each1Pecent) {
                    thisMusic.setUserSettings("time", percent);
                }
                currentTime.textContent =
                    thisMusic.convertTime(currentSongTime);
                if (timeBar.getAttribute("clicked") !== "true") {
                    timeBar.value = percent;
                    timeBar.style.background = thisMusic.setColor(percent);
                }
            }
        };

        volumeSlider.oninput = (e) => {
            const percent = e.target.value;
            currentSong.volume = percent / 100;
            volumeSlider.style.background = thisMusic.setColor(percent);
            thisMusic.setUserSettings("volume", currentSong.volume);
            if (
                (percent > 0 && thisMusic.settings.mute) ||
                (percent == 0 && !thisMusic.settings.mute)
            ) {
                thisMusic.muteSong();
            }
        };

        volumeSlider.addEventListener("wheel", (e) => {
            let changeValue = parseInt(e.deltaY * -0.05);
            let percent = Math.floor(currentSong.volume * 100 + changeValue);
            if (percent >= 0 && percent <= 100) {
                currentSong.volume = percent / 100;
                volumeSlider.style.background = thisMusic.setColor(percent);
                thisMusic.setUserSettings("volume", currentSong.volume);
                volumeSlider.value = percent;
                if (
                    (percent > 0 && thisMusic.settings.mute) ||
                    (percent == 0 && !thisMusic.settings.mute)
                ) {
                    thisMusic.muteSong();
                }
            }
        });

        timeBar.oninput = (e) => {
            const percent = e.target.value;
            timeBar.style.background = thisMusic.setColor(percent);
            timeBar.setAttribute("clicked", "true");
        };

        // Change the time bar
        timeBar.onclick = (e) => {
            const percent = e.target.value;
            thisMusic.setUserSettings("time", parseFloat(percent));
            currentSong.currentTime = (currentSong.duration / 100) * percent;
        };

        timeBar.onmouseup = function () {
            timeBar.setAttribute("clicked", "false");
        };

        currentSong.onended = () => {
            const length = thisMusic.songs.length;
            if (
                this.settings.repeating ||
                (!this.settings.repeating &&
                    this.settings.currentSongIndex !== length - 1)
            ) {
                thisMusic.nextSong();
                currentSong.play();
            }
        };

        playList.addEventListener("click", (e) => {
            const deleteClicked = e.target.closest(".del");
            const songClicked = e.target.closest(".song:not(.playing-song)");
            if (songClicked && !deleteClicked) {
                let clickedSongIndex = songClicked.getAttribute("song-index");
                thisMusic.settings.currentSongIndex =
                    parseInt(clickedSongIndex);
                thisMusic.loadSong();
                currentSong.play();
            }
            if (deleteClicked && confirm("Do you really want to delete it?")) {
                let clickedSongIndex =
                    deleteClicked.parentElement.getAttribute("song-index");
                const songId = thisMusic.songs[clickedSongIndex].songId;
                if (clickedSongIndex < thisMusic.settings.currentSongIndex) {
                    thisMusic.settings.currentSongIndex--;
                }
                deleteClicked.classList.add("hide-element");
                thisMusic.ajax(
                    `./php-api/delete-playlist-song.php?id=${songId}`,
                    (res) => {
                        if (res.status) {
                            thisMusic.songs = thisMusic.songs.filter(
                                (song, index) => index != clickedSongIndex
                            );
                            thisMusic.showPlayList();
                        } else {
                            deleteClicked.classList.remove("hide-element");
                        }
                    }
                );
            }
        });

        // handle input to search
        searchInput.addEventListener("input", (e) => {
            let kw = e.target.value.trim();
            if (!kw && !removeInput.classList.contains("hide-element")) {
                removeInput.classList.add("hide-element");
            }

            if (kw) {
                removeInput.classList.remove("hide-element");
                suggestList.classList.remove("hide-element");
                this.ajax(`./php-api/search-songs.php?kw=${kw}`, (res) => {
                    const newSuggestList = res.data;
                    searchBar.firstElementChild.classList.add("searching");
                    if (
                        !newSuggestList.length &&
                        searchBar.firstElementChild.classList.contains(
                            "searching"
                        )
                    ) {
                        searchBar.firstElementChild.classList.remove(
                            "searching"
                        );
                    }
                    const List = newSuggestList.map((song) => {
                        return `
                            <div song-id="${
                                song.songId
                            }" class="space-between song">
                                <div class="flex">
                                    <div class="song-image" style="background-image: url('${
                                        song.image
                                    }')"></div>
                                    <div class="music-infor">
                                        <div class="music-name">${
                                            song.name
                                        }</div>
                                        <div class="singer-name">${
                                            song.singerName
                                        }</div>
                                    </div>
                                </div>
                                ${
                                    thisMusic.songs.some(
                                        (s) => s.songId === song.songId
                                    )
                                        ? ""
                                        : '<button class="btn add"><i class="fa-solid fa-heart"></i></button>'
                                }
                            </div>
                            `;
                    });
                    suggestList.innerHTML = List.join("");
                });
            }
        });

        removeInput.addEventListener("click", () => {
            searchInput.value = "";
            removeInput.classList.add("hide-element");
        });

        // handle search
        searchBtn.addEventListener("click", () => {
            let kw = searchInput.value.trim();
            if (kw) {
            }
        });

        // on click add music
        suggestList.addEventListener("click", (e) => {
            const addSongClicked = e.target.closest(".add");
            if (addSongClicked) {
                addSongClicked.classList.add("hide-element");
                thisMusic.addNewSong(
                    addSongClicked.parentElement.getAttribute("song-id")
                );
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest("#search-bar")) {
                if (!suggestList.classList.contains("hide-element")) {
                    suggestList.classList.add("hide-element");
                }
                if (
                    searchBar.firstElementChild.classList.contains("searching")
                ) {
                    searchBar.firstElementChild.classList.remove("searching");
                }
            }
        });

        // show or hide playlists
        showPlayListBtn.addEventListener("click", () => {
            if (playListContainer.classList.contains("hide-element")) {
                playListContainer.classList.remove("hide-element");
                thisMusic.showPlayList();
            } else {
                playListContainer.classList.add("hide-element");
            }
        });

        // on click song list
        allSongList.addEventListener("click", (e) => {
            const addSongClicked = e.target.closest(".add");
            const songClicked = e.target.closest("#all-song-list .song");
            if (addSongClicked) {
                addSongClicked.classList.add("hide-element");
                thisMusic.addNewSong(
                    addSongClicked.parentElement.getAttribute("song-id")
                );
            }

            if (songClicked && !addSongClicked) {
                const songId = songClicked.getAttribute("song-id");
                const inPlaylistIndex = thisMusic.songs.findIndex(
                    (s) => s.songId === songId
                );
                var currentSongIndex;
                if (inPlaylistIndex >= 0) {
                    currentSongIndex = inPlaylistIndex;
                } else {
                    songClicked.lastElementChild.classList.add("hide-element");
                    thisMusic.addNewSong(songId);
                    setTimeout(() => {
                        currentSongIndex = thisMusic.songs.length - 1;
                    }, 100);
                }
                setTimeout(() => {
                    if (
                        thisMusic.settings.currentSongIndex != currentSongIndex
                    ) {
                        thisMusic.settings.currentSongIndex = currentSongIndex;
                        thisMusic.loadSong();
                        currentSong.play();
                    }
                }, 200);
            }
        });
    },

    start: function () {
        // Load all songs of playlists
        this.ajax("./php-api/get-playlist.php", (res) => {
            this.songs = res.data;
            // Call all methods of vmusic object
            if (this.songs.length) {
                // Show dashboard if it is hiden
                if (dashboard.classList.contains("hide-element")) {
                    dashboard.classList.remove("hide-element");
                }
                // Load settings
                this.loadSettings();
                // Set the song for playing
                this.setSong();
                // Show song list
                this.showPlayList();
                // Load song
                this.loadSong();
                // Load last time playing song
                this.loadLastTimePlaying();
            } else {
                dashboard.classList.add("hide-element");
            }
            // Listening and handling events
            this.handleEvents();
            // Load all songs of vmusic website
            this.showAllSongs();
        });
    },

    logout: function () {
        let check = confirm("Do you really want to log out?");
        if (check) {
            this.ajax("./php-api/logout.php", (res) => {
                if (res.status) {
                    location.href = "./login.php";
                } else {
                    alert(res.message);
                }
            });
        }
    },
};

vmusic.start();
