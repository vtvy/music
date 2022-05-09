<?php
    session_start();
    if (!isset($_SESSION['vmusic']) || $_SESSION["vmusic"] != 1) {
        header('Location: ../');
    }

    $page_title = "Admin page";
    $admin = true;
    require_once "../templates/header.php";
?>
<main class="form-container">
    <div id="song-side">

        <form class="form" id="add-song" action="../php-api/add-song.php" method="POST" enctype="multipart/form-data">
            <h2 class="title">Add a new song</h2>
            <div class="input-container">
                <input id="song-name" class="input" name="song-name" type="text" placeholder=" " required />
                <div class="cut"></div>
                <label for="song-name" class="placeholder">name</label>
            </div>
            <div id="song-warning" class="warning"></div>
            <div class="input-container">
                <input id="song-image" class="input" name="song-image" type="file" accept=".jpg, .jpeg, .png" placeholder=" " required />
                <div class="cut"></div>
                <label for="song-image" class="placeholder">image</label>
            </div>
            <div id="image-warning" class="warning"></div>
            <div class="input-container">
                <input id="song-file" name="song-file" accept=".mp3, .m4a" class="input" type="file" placeholder=" " required />
                <div class="cut"></div>
                <label for="song-file" class="placeholder">song</label>
            </div>
            <div id="file-warning" class="warning"></div>
            <div class="input-container">
                <select id="song-singer" name="singer-id" class="input" type="select" required>
                    <option value="">Select a singer</option>
                    <?php
                    require_once "../data/mysql-connection.php";
                    $query = "SELECT singer_id, singer_name FROM singers;";
                    $result = $conn->query($query);
                    if ($result && $result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo "<option value='$row[singer_id]'>$row[singer_name]</option>";
                        }
                    }
                    ?>
                </select>
                <div class="cut"></div>
                <label for="song-file" class="placeholder">singer</label>
            </div>
            <div id="select-warning" class="warning"></div>
            <button type="text" class="submit-btn" id="song-submit-btn">Add a song</button>
        </form>
        <div id="edit-song-list">
            <?php require_once "../data/mysql-connection.php";
            $query = "SELECT s.s_id, s.singer_id, sg.singer_name, s.s_name FROM songs s LEFT OUTER JOIN singers sg
            ON s.singer_id = sg.singer_id
            ORDER BY s_id;";
            $result = $conn->query($query);
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo
                    "<div class='edit-song'>
                        <h4>$row[s_name]</h4>
                        <div class='update-delete-icon flex' editFor='$row[s_id]'>
                            <h5>$row[singer_name]</h5>
                            <i class='fa-solid fa-pen-to-square btn edit'></i>
                            <i class='fa-solid fa-trash warning btn del'></i>
                        </div>
                    </div>";
                }
            } ?>
        </div>

    </div>
    <div id="singer-side">
        <form class="form" id="add-singer">
            <h2 class="title">Add a new singer</h2>
            <div class="input-container">
                <input id="singer-name" class="input" type="text" placeholder=" " />
                <div class="cut"></div>
                <label for="singer-name" class="placeholder">singer</label>
            </div>
            <div id="singer-warning" class="warning"></div>
            <button type="text" id="singer-submit-btn" type="button" class="submit-btn">Add new singer</button>
        </form>
        <div id="singer-list">
            <?php require_once "../data/mysql-connection.php";
            $query = "SELECT sg.singer_id, sg.singer_name, COUNT(s.s_id) as song_cnt
            FROM singers sg LEFT OUTER JOIN songs s ON s.singer_id = sg.singer_id 
            GROUP BY sg.singer_id ORDER BY sg.singer_id;";
            $result = $conn->query($query);
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $singer = 
                    "<div class='singer'>
                        <h4>$row[singer_name]</h4>
                        <div class='update-delete-icon flex' editFor='$row[singer_id]' numberSong='$row[song_cnt]'>
                            <h5>$row[song_cnt] songs</h5>
                            <i class='fa-solid fa-pen-to-square btn edit'></i>";
                    $del = ($row["song_cnt"]==0)?"<i class='fa-solid fa-trash warning del btn'></i>":"";
                    $footer = "</div></div>";
                    echo $singer . $del . $footer;
                }
            } ?>
        </div>
    </div>
</main>
 
<script src="../js/ajax.js?v=<?php echo time() ?>"> </script>
<script>
    // edit song
    document.querySelectorAll("#edit-song-list .edit").forEach(function(edit) {
        edit.addEventListener("click", function(e) {
            let songId = e.target.parentNode.attributes['editFor'].value;
            let songNameElement = e.target.parentNode.previousElementSibling;
            let songName = songNameElement.innerText;
            if (songNameElement.outerText !== ' Update') {
                songNameElement.parentElement.classList.add("flex-col");
                songNameElement.innerHTML =
                    `<input value='${songName}' oldValue='${songName}' />
                     <button class='update-btn' onclick='updateSongName(this.parentNode,${songId});'>Update</button>
                `;
                songNameElement.firstChild.focus();
            }
        })
    })

    function updateSongName(e, songId) {
        let newSongName = e.firstChild.value.trim();
        let oldName = e.firstChild.attributes['oldValue'].value;
        if (newSongName !== oldName && newSongName) {
            updateSong(songId, newSongName, e);
        } else {
            e.innerHTML = `${oldName}`;
        }
        e.parentElement.classList.remove("flex-col");
    }

    // delete song
    document.querySelectorAll("#edit-song-list .del").forEach(function(del) {
        del.addEventListener("click", function(e) {
            let parentNode = e.target.parentNode;
            let songId = parentNode.attributes['editFor'].value;
            if (parentNode.previousElementSibling.outerText !== ' Update') {
                if (confirm("Do you really want to delete this song ?")) {
                    deleteSong(songId, parentNode);
                }
            }
        })
    })

    // add new singer
    document.getElementById("singer-submit-btn").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("singer-warning").textContent = ""
        let singerName = document.getElementById("singer-name").value.trim();
        let selectSingers = document.getElementById("song-singer");
        let singerWarning = document.getElementById("singer-warning");
        let singerList = document.getElementById("singer-list");
        let lastIndex = singerList.lastElementChild.lastElementChild.attributes['editFor'].value;
        if (!singerName) {
            singerWarning.textContent = "Please enter singer name"
            document.getElementById("singer-name").focus();
        } else {
            addSinger(singerName, selectSingers, singerList, singerWarning, lastIndex);
            document.getElementById("singer-name").value = "";
        }
    });

    // edit singer name
    document.querySelectorAll("#singer-list .edit").forEach(function(edit) {
        edit.addEventListener("click", function(e) {
            let singerId = e.target.parentNode.attributes['editFor'].value;
            let singerNameElement = e.target.parentNode.previousElementSibling;
            let singerName = singerNameElement.innerText;
            if (singerNameElement.outerText !== ' Update') {
                singerNameElement.innerHTML =
                    `<input value='${singerName}' oldValue='${singerName}' />
                    <button class='update-btn' onclick='updateSingerName(this.parentNode,${singerId});'>Update</button>
                `;
                singerNameElement.firstChild.focus();
            }
        })
    })

    function updateSingerName(e, singerId) {
        let newSingerName = e.firstChild.value.trim();
        let singerName = e.firstChild.attributes['oldValue'].value;
        let selectSingers = document.getElementById("song-singer");
        if (newSingerName !== singerName && newSingerName) {
            updateSinger(singerId, newSingerName, e, selectSingers);
        } else {
            e.innerHTML = `${singerName}`;
        }

    }

    // delete singer
    document.querySelectorAll("#singer-list .del").forEach(function(del) {
        del.addEventListener("click", function(e) {
            let parentElement = e.target.parentElement;
            let singerId = parentElement.attributes['editFor'].value;
            let numberSong = parentElement.attributes['numberSong'].value;
            if (parentElement.previousElementSibling.outerText !== ' Update' && numberSong === '0') {

                if (confirm("Do you really want to delete this singer ?")) {
                    deleteSinger(singerId, parentElement);
                }
            }
        })
    })
</script>
<?php
    require_once '../templates/footer.php'
?>