<?php
$page_title = "Admin page";
$css = "../assets/css/main";
require_once "../templates/header.php";
?>
<main class="form-container">
    <div id="song-side">

        <form class="form" id="add-song" action="../php-api/add-song.php" method="POST" enctype="multipart/form-data">
            <h2 class="title">Add a new song</h2>
            <div class="input-container">
                <input id="song-name" class="input" name="song-name" type="text" placeholder=" " required />
                <div class="cut"></div>
                <label for="song-name" class="placeholder">song name</label>
            </div>
            <div id="song-warning" class="warning"></div>
            <div class="input-container">
                <input id="song-image" class="input" name="song-image" type="file" accept=".jpg, .jpeg, .png" placeholder=" " required />
                <label for="song-image" class="placeholder">song image</label>
            </div>
            <div id="image-warning" class="warning"></div>
            <div class="input-container">
                <input id="song-file" name="song-file" accept=".mp3" type="file" placeholder=" " required />
                <label for="song-file" class="placeholder">song file</label>
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
            </div>
            <div id="select-warning" class="warning"></div>
            <button type="text" class="submit" id="song-submit-btn">Add a song</button>
        </form>
        <div id="edit-song-list">
            <div class="edit-song">
                <h4>dsad</h4>
                <select id="edit-singer" class="input" type="select" required>
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
            </div>
        </div>

    </div>
    <div id="singer-side">
        <form class="form" id="add-singer">
            <h2 class="title">Add a new singer</h2>
            <div class="input-container">
                <input id="singer-name" class="input" type="text" placeholder=" " />
                <div class="cut"></div>
                <label for="singer-name" class="placeholder">singer name</label>
            </div>
            <div id="singer-warning" class="warning"></div>
            <button type="text" id="singer-submit-btn" type="button" class="submit">Add new singer</button>
        </form>
        <div id="singer-list">

            <?php require_once "../data/mysql-connection.php";
            $query = "SELECT sg.singer_id, sg.singer_name, COUNT(s.s_id) as song_cnt
            FROM singers sg LEFT OUTER JOIN songs s ON s.singer_id = sg.singer_id 
            GROUP BY sg.singer_id ORDER BY sg.singer_id;";
            $result = $conn->query($query);
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo
                    "<div class='singer'>
                        <h4>$row[singer_name]</h4>
                        <div class='update-delete-icon flex' editFor='$row[singer_id]' numberSong='$row[song_cnt]'>
                            <h5>$row[song_cnt] songs</h5>
                            <i class='fa-solid fa-pen-to-square edit'></i>
                            <i class='fa-solid fa-trash warning del'></i>
                        </div>
                    </div>";
                }
            } ?>
        </div>
    </div>
</main>
<script src="../js/ajax.js?v=<?php echo time() ?>"> </script>
<script>
    // add new singer
    document.getElementById("singer-submit-btn").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("singer-warning").textContent = ""
        let singer_name = document.getElementById("singer-name").value;
        let selectSingers = document.getElementById("song-singer");
        let singerWarning = document.getElementById("singer-warning");
        let singerList = document.getElementById("singer-list");
        let lastIndex = singerList.lastElementChild.lastElementChild.attributes['editFor'].value;
        if (!singer_name) {
            textContent = "Please enter singer name"
        } else {
            addSinger(singer_name, selectSingers, singerList, singerWarning, lastIndex);
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
            }
        })
    })

    function updateSingerName(e, singerId) {
        let newSingerName = e.firstChild.value;
        let singerName = e.firstChild.attributes['oldValue'].value;

        if (newSingerName !== singerName) {
            updateSinger(singerId, newSingerName, e);
        } else {
            e.innerHTML = `${singerName}`;
        }

    }

    // delete singer
    document.querySelectorAll("#singer-list .del").forEach(function(del) {
        del.addEventListener("click", function(e) {
            let parentNode = e.target.parentNode;
            let singerId = parentNode.attributes['editFor'].value;
            let numberSong = parentNode.attributes['numberSong'].value;
            if (parentNode.previousElementSibling.outerText !== ' Update' && numberSong === '0') {
                deleteSinger(singerId, parentNode);
            }
        })
    })

    // function updateSingerName(e, singerId) {
    //     let singerName = e.firstChild.value;
    //     updateSinger(singerId, singerName, e);
    // }
</script>
<?php
require_once '../templates/footer.php'
?>