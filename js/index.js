const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const songList = $("#song-list");
const searchBar = $("#search-bar");
const searchInput = $("#search-input");
const removeInput = $("#remove-kw-search");
const searchBtn = $("#search-btn");
const suggestList = $("#suggest-list");
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

const vmusic = {
    playing: false,
    playingNumber: 0,
    settings: JSON.parse(localStorage.getItem("settings")) || {},

    setUserSettings: function (key, value) {
        this.settings[key] = value;
        localStorage.setItem("settings", JSON.stringify(this.settings));
    },

    songs: [],

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
    showSongList: function () {
        const List = this.songs.map((song, index) => {
            return `
                <div song-index="${index}" class="flex space-between song ${
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

        songList.innerHTML = List.join("");
    },

    loadSettings: function () {
        if (
            typeof this.settings.currentSongIndex !== "number" ||
            isNaN(this.settings.currentSongIndex) ||
            this.settings.currentSongIndex > this.songs.length - 1
        ) {
            this.settings.currentSongIndex = 0;
        }

        if (!(this.settings.volume >= 0 && this.settings.volume <= 1)) {
            this.settings.volume = 1;
        }

        if (typeof this.settings.mute !== "boolean") {
            this.settings.mute = false;
        }

        if (typeof this.settings.random !== "boolean") {
            this.settings.random = false;
        }

        if (typeof this.settings.repeating !== "boolean") {
            this.setUserSettings("repeating", false);
        }

        // Set the default UI for user settings

        if (this.settings.mute) {
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

        if (this.settings.repeating) {
            repeatBtn.classList.toggle("active", this.settings.repeating);
        }

        if (this.settings.random) {
            randomBtn.classList.toggle("active", this.settings.random);
        }
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
            durationTime.textContent = this.convertTime(currentSong.duration);
            $(".song.playing-song").classList.remove("playing-song");
            $(
                `.song[song-index="${this.settings.currentSongIndex}"]`
            ).classList.add("playing-song");
            this.scrollIntoView();
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
            `.song[song-index="${this.settings.currentSongIndex}"]`
        ).scrollIntoView({
            behavior: "smooth",
            block: "center",
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
                currentTime.textContent =
                    thisMusic.convertTime(currentSongTime);
                if (timeBar.getAttribute("clicked") !== "true") {
                    const percent = (currentSongTime / duration) * 100;
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
            if (percent / 100 > 0 && thisMusic.settings.mute) {
                thisMusic.muteSong();
            }
            if (percent == 0 && !thisMusic.settings.mute) {
                thisMusic.muteSong();
            }
        };

        timeBar.oninput = (e) => {
            const percent = e.target.value;
            timeBar.style.background = thisMusic.setColor(percent);
            timeBar.setAttribute("clicked", "true");
        };

        // Change the time bar
        timeBar.onclick = (e) => {
            const percent = e.target.value;
            currentSong.currentTime = (currentSong.duration / 100) * percent;
        };

        timeBar.onmouseup = function () {
            timeBar.setAttribute("clicked", "false");
        };

        currentSong.onended = () => {
            const length = thisMusic.songs.length;
            thisMusic.playingNumber++;
            if (
                (thisMusic.playingNumber >= 15 &&
                    !thisMusic.settings.repeating) ||
                (thisMusic.playingNumber === 10 * length &&
                    thisMusic.settings.repeating) ||
                ((thisMusic.settings.currentSongIndex >= length - 1 ||
                    thisMusic.playingNumber >= length - 1) &&
                    !thisMusic.settings.repeating)
            ) {
                currentSong.pause();
            } else {
                thisMusic.nextSong();
                currentSong.play();
            }
        };

        songList.addEventListener("click", (e) => {
            const deleteClicked = e.target.closest(".del");
            const songClicked = e.target.closest(".song:not(.playing-song)");
            if (songClicked && !deleteClicked) {
                let clickedSongIndex = songClicked.getAttribute("song-index");
                thisMusic.settings.currentSongIndex =
                    parseInt(clickedSongIndex);
                thisMusic.loadSong();
                currentSong.play();
            }
            if (deleteClicked) {
                let clickedSongIndex =
                    deleteClicked.parentElement.getAttribute("song-index");
                if (clickedSongIndex < thisMusic.settings.currentSongIndex) {
                    thisMusic.settings.currentSongIndex--;
                }
                thisMusic.songs = thisMusic.songs.filter(
                    (song, index) => index != clickedSongIndex
                );
                thisMusic.showSongList();
            }
        });

        // handle input to search
        searchInput.addEventListener("input", (e) => {
            let kw = e.target.value.trim();
            if (!kw && !removeInput.classList.contains("hide-element")) {
                removeInput.classList.add("hide-element");
            } else {
                removeInput.classList.remove("hide-element");
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
                searchBar.firstElementChild.classList.add("searching");
                suggestList.classList.remove("hide-element");
                this.ajax(`./php-api/search-songs.php?kw=${kw}`, (res) => {
                    const List = res.data.map((song) => {
                        return `
                            <div song-id="${
                                song.songId
                            }" class="flex space-between song">
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

        // on click add music
        suggestList.addEventListener("click", (e) => {
            const addSongClicked = e.target.closest(".add");
            if (addSongClicked) {
                addSongClicked.classList.add("hide-element");
                thisMusic.ajax(
                    `./php-api/add-a-song.php?id=${addSongClicked.parentElement.getAttribute(
                        "song-id"
                    )}`,
                    (res) => {
                        const thisSong = res.data;
                        thisMusic.songs.push(thisSong);
                        thisMusic.showSongList();
                    }
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
    },

    start: function () {
        // Load all songs
        this.ajax("./php-api/get-songs.php", (res) => {
            this.songs = res.data;
            if (this.songs.length) {
                // Load settings
                this.loadSettings();
                // Set the song for playing
                this.setSong();
                // Listening and handling events
                this.handleEvents();
                // Show song list
                this.showSongList();
                // Load song
                this.loadSong();
            } else {
                location.href = "./login.php";
            }
        });
    },
};

vmusic.start();
