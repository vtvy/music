<?php
    require_once "mysql-connection.php";
    
    function title_search($title) {
        global $conn;
        $keyword = trim($title);
        $new_kw = str_replace(" ", "%' OR b.tieude LIKE '%", $keyword);
        $query = "SELECT b.ma_bviet, b.tieude, t.ten_tgia, b.ngayviet, b.ten_bhat, tl.ten_tloai, b.tomtat
                 FROM baiviet b join tacgia t on b.ma_tgia = t.ma_tgia join theloai tl on b.ma_tloai = tl.ma_tloai 
                 WHERE b.tieude LIKE '%$new_kw%'";
        $result = $conn->query($query)
            or die("Query failed: " . $conn->error);
        if ($result->num_rows > 0) {
            echo "<br><br><h2>Kết quả tìm kiếm: " . $result->num_rows . " bài viết</h1>";
            while ($row = $result->fetch_assoc()) {
                echo <<<_SHOW_POSTS
                <div class="row">
                <div class="left-item">Mã bài viết</div>
                <div class="right-item">$row[ma_bviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tiêu đề</div>
                    <div class="right-item">$row[tieude]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tác giả</div>
                    <div class="right-item">$row[ten_tgia]</div>
                </div>
                <div class="row">
                    <div class="left-item">Ngày viết</div>
                    <div class="right-item">$row[ngayviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Bài hát</div>
                    <div class="right-item">$row[ten_bhat]</div>
                </div>
                <div class="row">
                    <div class="left-item">Thể loại</div>
                    <div class="right-item">$row[ten_tloai]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tóm tắt</div>
                    <div class="right-item">$row[tomtat]</div>
                </div>
                <hr>
            _SHOW_POSTS;
            }
        }
        else   echo "No result found";
    }
    
    function title_search_2($title) {
        global $conn;
        $keyword = trim($title);
        $first_quotation = strpos( $keyword, '"');
        $last_quotation = strpos( $keyword, '"', $first_quotation + 1);
        $first_key = trim(substr($keyword, 0, $first_quotation));
        $second_key = trim(substr($keyword, $first_quotation + 1, $last_quotation - $first_quotation - 1));
        $last_key = trim(substr($keyword, $last_quotation + 1));
        $first_key = str_replace(" ", "%' OR b.tieude LIKE '%", $first_key);
        $last_key = str_replace(" ", "%' OR b.tieude LIKE '%", $last_key);
        if ($first_key !="") $second_key = "%' OR b.tieude LIKE '%" . $second_key;
        if ($last_key != "") $second_key = $second_key . "%' OR b.tieude LIKE '%";

        $new_kw = $first_key . $second_key . $last_key;
        $query = "SELECT b.ma_bviet, b.tieude, t.ten_tgia, b.ngayviet, b.ten_bhat, tl.ten_tloai, b.tomtat
                 FROM baiviet b join tacgia t on b.ma_tgia = t.ma_tgia join theloai tl on b.ma_tloai = tl.ma_tloai 
                 WHERE b.tieude LIKE '%$new_kw%'";
        $result = $conn->query($query)
            or die("Query failed: " . $conn->error);
        if ($result->num_rows > 0) {
            echo "<br><br><h2>Kết quả tìm kiếm: " . $result->num_rows . " bài viết</h1>";
            while ($row = $result->fetch_assoc()) {
                echo <<<_SHOW_POSTS
                <div class="row">
                <div class="left-item">Mã bài viết</div>
                <div class="right-item">$row[ma_bviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tiêu đề</div>
                    <div class="right-item">$row[tieude]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tác giả</div>
                    <div class="right-item">$row[ten_tgia]</div>
                </div>
                <div class="row">
                    <div class="left-item">Ngày viết</div>
                    <div class="right-item">$row[ngayviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Bài hát</div>
                    <div class="right-item">$row[ten_bhat]</div>
                </div>
                <div class="row">
                    <div class="left-item">Thể loại</div>
                    <div class="right-item">$row[ten_tloai]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tóm tắt</div>
                    <div class="right-item">$row[tomtat]</div>
                </div>
                <hr>
            _SHOW_POSTS;
            }
        }
        else   echo "No result found";
    }

    function get_ma_bviet() {
        global $conn;
        $query = "SELECT MAX(ma_bviet) as ma FROM baiviet";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                return $row["ma"] + 1;
            }
        }
        else return "NO HOPE";
    }

    function get_all() {
        global $conn;
        $query = "SELECT b.ma_bviet, b.tieude, t.ten_tgia, b.ngayviet, b.ten_bhat, tl.ten_tloai, b.tomtat
                 FROM baiviet b join tacgia t on b.ma_tgia = t.ma_tgia 
                 join theloai tl on b.ma_tloai = tl.ma_tloai";
        $result = $conn->query($query) or die("Query failed: " . $conn->error);
        if ($result->num_rows > 0) {
            echo "<br><br><h2>Toàn bộ bài hát: " . $result->num_rows . " bài viết</h1>";
            while ($row = $result->fetch_assoc()) {
                echo <<<_SHOW_POSTS
                <div class="row">
                <div class="left-item">Mã bài viết</div>
                <div class="right-item">$row[ma_bviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tiêu đề</div>
                    <div class="right-item">$row[tieude]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tác giả</div>
                    <div class="right-item">$row[ten_tgia]</div>
                </div>
                <div class="row">
                    <div class="left-item">Ngày viết</div>
                    <div class="right-item">$row[ngayviet]</div>
                </div>
                <div class="row">
                    <div class="left-item">Bài hát</div>
                    <div class="right-item">$row[ten_bhat]</div>
                </div>
                <div class="row">
                    <div class="left-item">Thể loại</div>
                    <div class="right-item">$row[ten_tloai]</div>
                </div>
                <div class="row">
                    <div class="left-item">Tóm tắt</div>
                    <div class="right-item">$row[tomtat]</div>
                </div>
                <hr>
            _SHOW_POSTS;
            }
        }
        else   echo "No result found";
    }
?>