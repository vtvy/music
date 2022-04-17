const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $("#cd");
const prevBtn = $("#prev-btn");
const playBtn = $("#play-button");
const nextBtn = $("#next-btn");
const currentSong = $("#current-song");
const timeBar = $("#time-bar");
const songList = $("#song-list");
const music = {
    currentIndexSong: 1,
    playing: false,
    random: false,
    repeat: false,
    settings: {},
    songs: [
        {
            name: "Hai đám mây",
            singer: "Khói",
            path: "./assets/music/song1.mp3",
            image: "./assets/images/image1.jpg",
        },
        {
            name: "See tình",
            singer: "Hoàng Thùy Linh",
            path: "./assets/music/song2.mp3",
            image: "./assets/images/image2.jpg",
        },
        {
            name: "Muộn rồi mà sao còn",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/song3.mp3",
            image: "./assets/images/image3.jpg",
        },
        {
            name: "Hãy trao cho anh",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/song4.mp3",
            image: "./assets/images/image4.jpg",
        },
        {
            name: "Chạy ngay đi",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/song5.mp3",
            image: "./assets/images/image5.jpg",
        },
        {
            name: "Chúng ta của hiện tại",
            singer: "Khói",
            path: "./assets/music/song6.m4a",
            image: "./assets/images/image6.jpg",
        },
        {
            name: "Là do em xui thôi",
            singer: "Khói",
            path: "./assets/music/song7.mp3",
            image: "./assets/images/image7.jpg",
        },
        {
            name: "Hai đám mây",
            singer: "Khói",
            path: "./assets/music/song1.mp3",
            image: "./assets/images/image1.jpg",
        },
    ],

    // Show list of music
    showSongList: function () {
        const List = this.songs.map((song, index) => {
            return `
                <div class="song">
                    <div class="song-image" style="background-image: url('${song.image}')"></div>
                    <div class="song-name">${song.name}</div>
                </div>
            `;
        });

        songList.innerHTML = List.join("");
    },

    setSong: function () {
        Object.defineProperty(this, "dashboardSong", {
            get: function () {
                return this.songs[this.currentIndexSong];
            },
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

        prevBtn.onclick = () => {
            if (this.currentIndexSong === 0) {
                this.currentIndexSong = this.songs.length - 1;
            } else {
                this.currentIndexSong--;
            }
            this.loadSong();
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
            if (this.currentIndexSong === this.songs.length - 1) {
                this.currentIndexSong = 0;
            } else {
                this.currentIndexSong++;
            }
            this.loadSong();
            currentSong.play();
        };

        currentSong.onplay = function () {
            thisMusic.playing = true;
            playBtn.classList.add("playing");
            cdRotate.play();
        };

        currentSong.onpause = function () {
            thisMusic.playing = false;
            playBtn.classList.remove("playing");
            cdRotate.pause();
        };

        // Set the time bar
        currentSong.ontimeupdate = function () {
            const duration = currentSong.duration;
            if (duration) {
                const currentTime = currentSong.currentTime;
                const percent = (currentTime / duration) * 100;
                timeBar.value = percent;
                const color = `linear-gradient(90deg, #bd1b4b ${percent}%, #ccc  ${percent}%)`;
                timeBar.style.background = color;
            }
        };

        timeBar.onmousemove = function (e) {
            console.log(this.clicked);
            const percent = e.target.value;
            const color = `linear-gradient(90deg, #bd1b4b ${percent}%, #ccc  ${percent}%)`;
            timeBar.style.background = color;
        };

        // Change the time bar
        timeBar.onclick = function (e) {
            const percent = e.target.value;
            currentSong.currentTime = (currentSong.duration / 100) * percent;
        };
    },

    loadSong: function () {
        $("#music-name").textContent = this.dashboardSong.name;
        $(
            ".dashboard-cd"
        ).style.backgroundImage = `url('${this.dashboardSong.image}')`;
        currentSong.src = this.dashboardSong.path;
    },

    start: function () {
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
