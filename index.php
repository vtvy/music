<?php
$page_title = "Home page";
$css = "./assets/css/main";
require_once "./templates/header.php";
?>
<div id="main">
    <header id="header" class="flex">
        <div id="left-nav">V MUSIC</div>
        <div id="search-bar">
            <div class="input-container flex ">
                <input id="search-input" type="text" class="input" placeholder="Nhập tên bài hát" value="">
                <button id="search-btn" class="btn"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div id="suggest-list" class=""></div>
        </div>
        <div id="user-bar">VeoCT</div>
    </header>
    <div id="song-list"></div>
    <div id="dashboard">
        <div id="left-db">
            <div id="cd">
                <div class="dashboard-cd"></div>
            </div>
            <div class="music-infor">
                <div id="db-music-name" class="music-name"></div>
                <div id="db-singer-name" class="singer-name"></div>
            </div>
        </div>
        <div id="center-db">
            <div id="control">
                <div id="main-control">
                    <div id="repeat-btn" class="control-button">
                        <i class="fa-solid fa-repeat"></i>
                    </div>

                    <div id="prev-btn" class="control-button">
                        <i class="fas fa-step-backward"></i>
                    </div>
                    <div id="play-button" class="control-button toggle-play">
                        <i class="fa-solid fa-circle-pause pause-btn"></i>
                        <i class="fa-solid fa-circle-play play-btn"></i>
                    </div>
                    <div id="next-btn" class="control-button">
                        <i class="fas fa-step-forward"></i>
                    </div>
                    <div id="random-btn" class="control-button">
                        <i class="fas fa-random"></i>
                    </div>
                </div>
            </div>
            <div id="timebar-container">
                <div id="current-time" class="time">00:00</div>
                <input type="range" id="time-bar" class="slider" value="0" step="1" min="1" max="100" />
                <div id="duration-time" class="time">00:00</div>
            </div>
        </div>
        <div id="right-db">
            <div id="volume-btn">
                <input type="range" id="volume-slider" class="slider" value="100" step="5" min="0" max="100" />
                <i class="fa-solid fa-volume-high show" id="on-volume"></i>
                <i class="fa-solid fa-volume-xmark" id="mute-volume"></i>
            </div>
        </div>
        <audio id="current-song" src=""></audio>
    </div>
</div>
<script src="./js/index.js?v=<?php echo time(); ?>">
</script>
<?php
require_once './templates/footer.php'
?>