const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $("#cd");
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
const songList = $("#song-list");
const music = {
    playing: false,
    playingNumber: 0,
    settings: JSON.parse(localStorage.getItem("settings")) || {},

    setUserSettings: function (key, value) {
        this.settings[key] = value;
        localStorage.setItem("settings", JSON.stringify(this.settings));
    },
    songs: [
        {
            name: "3107",
            owner: "W/n, Duongg, Nâu",
            path: "./assets/music/song1.mp3",
            image: "./assets/images/image1.jpg",
        },
        {
            name: "See tình",
            owner: "Hoàng Thùy Linh",
            path: "./assets/music/song2.mp3",
            image: "./assets/images/image2.jpg",
        },
        {
            name: "Muộn rồi mà sao còn",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song3.mp3",
            image: "./assets/images/image3.jpg",
        },
        {
            name: "Hãy trao cho anh",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song4.mp3",
            image: "./assets/images/image4.jpg",
        },
        {
            name: "Chạy ngay đi",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song5.mp3",
            image: "./assets/images/image5.jpg",
        },
        {
            name: "Chúng ta của hiện tại",
            owner: "Khói",
            path: "./assets/music/song6.m4a",
            image: "./assets/images/image6.jpg",
        },
        {
            name: "Là do em xui thôi",
            owner: "Khói",
            path: "./assets/music/song7.mp3",
            image: "./assets/images/image7.jpg",
        },
        {
            name: "Hai đám mây",
            owner: "Khói",
            path: "./assets/music/song8.mp3",
            image: "./assets/images/image8.jpg",
        },
        {
            name: "3107",
            owner: "W/n, Duongg, Nâu",
            path: "./assets/music/song1.mp3",
            image: "./assets/images/image1.jpg",
        },
        {
            name: "See tình",
            owner: "Hoàng Thùy Linh",
            path: "./assets/music/song2.mp3",
            image: "./assets/images/image2.jpg",
        },
        {
            name: "Muộn rồi mà sao còn",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song3.mp3",
            image: "./assets/images/image3.jpg",
        },
        {
            name: "Hãy trao cho anh",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song4.mp3",
            image: "./assets/images/image4.jpg",
        },
        {
            name: "Chạy ngay đi",
            owner: "Sơn Tùng MTP",
            path: "./assets/music/song5.mp3",
            image: "./assets/images/image5.jpg",
        },
        {
            name: "Chúng ta của hiện tại",
            owner: "Khói",
            path: "./assets/music/song6.m4a",
            image: "./assets/images/image6.jpg",
        },
        {
            name: "Là do em xui thôi",
            owner: "Khói",
            path: "./assets/music/song7.mp3",
            image: "./assets/images/image7.jpg",
        },
        {
            name: "Hai đám mây",
            owner: "Khói",
            path: "./assets/music/song8.mp3",
            image: "./assets/images/image8.jpg",
        },
    ],

    // Show list of music
    showSongList: function () {
        const List = this.songs.map((song, index) => {
            return `
                <div song-index="${index}" class="song ${
                index === this.settings.currentSongIndex ? "playing-song" : ""
            }">
                    <div class="song-image" style="background-image: url('${
                        song.image
                    }')"></div>
                    <div class="song-name">${song.name}</div>
                </div>
            `;
        });

        songList.innerHTML = List.join("");
    },

    loadSettings: function () {
        if (
            typeof this.settings.currentSongIndex !== "number" ||
            isNaN(this.settings.currentSongIndex)
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
            currentSong.mute = true;
            volumeSlider.style.background = this.setColor(0);
        } else {
            volumeSlider.value = this.settings.volume * 100;
            volumeSlider.style.background = this.setColor(volumeSlider.value);
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
        return `linear-gradient(90deg, #bd1b4b ${percent}%, #ccc  ${percent}%)`;
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
        $("#music-name").textContent = this.dashboardSong.name;
        $(
            ".dashboard-cd"
        ).style.backgroundImage = `url('${this.dashboardSong.image}')`;
        currentSong.src = this.dashboardSong.path;
        setTimeout(() => {
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
        this.setUserSettings("settings.mute", this.settings.mute);
        $("#on-volume").classList.toggle("show", !this.settings.mute);
        $("#mute-volume").classList.toggle("show", this.settings.mute);
        if (this.settings.mute) {
            volumeSlider.value = 0;
            currentSong.mute = true;
            volumeSlider.style.background = this.setColor(0);
        } else {
            volumeSlider.value = this.settings.volume * 100;
            currentSong.mute = false;
            volumeSlider.style.background = this.setColor(
                this.settings.volume * 100
            );
        }
    },

    scrollIntoView: function () {
        $(
            `.song[song-index="${this.settings.currentSongIndex}"]`
        ).scrollIntoView({
            behavior: "smooth",
            block: "start",
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
                "settings.repeating",
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
            if (durationTime.textContent === "" && currentSong.duration) {
                durationTime.textContent = thisMusic.convertTime(
                    currentSong.duration
                );
            }
            thisMusic.settings.playing = true;
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

        volumeSlider.onmousemove = (e) => {
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

        timeBar.onmousedown = () => {
            timeBar.setAttribute("clicked", "true");
        };

        timeBar.onmousemove = (e) => {
            const percent = e.target.value;
            timeBar.style.background = thisMusic.setColor(percent);
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
                (thisMusic.settings.currentSongIndex >= length - 1 &&
                    !thisMusic.settings.repeating)
            ) {
                currentSong.pause();
            } else {
                thisMusic.nextSong();
                currentSong.play();
            }
        };

        songList.onclick = (e) => {
            const clickedSongIndex =
                e.target.getAttribute("song-index") ||
                e.target.parentElement.getAttribute("song-index");
            if (clickedSongIndex != thisMusic.settings.currentSongIndex) {
                thisMusic.settings.currentSongIndex = clickedSongIndex;
                thisMusic.loadSong();
            }
            currentSong.play();
        };
    },

    start: function () {
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
    },
};

music.start();
