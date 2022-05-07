-- Vo Trieu Vy B1910730
drop database if exists vmusic;
create database vmusic;
use vmusic;
SET GLOBAL log_bin_trust_function_creators = 1;

-- create users table
create table users (
	uid int auto_increment,
    username varchar(30) not null unique,
    passwd varchar(50) not null,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key(uid)
);

-- create singers table
create table singers (
	singer_id int auto_increment,
    singer_name varchar(30) not null unique,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key(singer_id)
);

-- create songs table
create table songs(
	s_id int auto_increment,
    singer_id int not null,
    s_name varchar(50) not null,
    s_path varchar(500) not null,
    s_img_path varchar(500) not null,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key(s_id),
    foreign key(singer_id) references singers(singer_id)
);

-- create playlist table
create table playlists(
    s_id int,
    uid int,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key (s_id, uid),
	foreign key(s_id) references songs(s_id),
    foreign key(uid) references users(uid)
);

-- insert value
insert into users (uid, username, passwd) values (1, "votrieuvy", "b1910730");
insert into singers (singer_id, singer_name) values(1, "Big Bang");
insert into singers (singer_id, singer_name) values(2, "Sơn Tùng MTP");
insert into singers (singer_id, singer_name) values(3, "Hoàng Thùy Linh");
insert into singers (singer_id, singer_name) values(4, "W/n");
insert into singers (singer_id, singer_name) values(5, "Khói");
insert into singers (singer_id, singer_name) values(6, "ERIK");
insert into singers (singer_id, singer_name) values(7, "Anh Tú");
insert into singers (singer_id, singer_name) values(8, "Đình Dũng");
insert into singers (singer_id, singer_name) values(9, "Binz");
insert into singers (singer_id, singer_name) values(10, "Thiều Bảo Trâm");
insert into singers (singer_id, singer_name) values(11, "Mỹ Tâm");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)

        values(1, 4, "3107", "./assets/music/song1.mp3", "./assets/images/image1.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(2, 3, "See tình", "./assets/music/song2.mp3", "./assets/images/image2.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(3, 2, "Muộn rồi mà sau còn", "./assets/music/song3.mp3", "./assets/images/image3.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(4, 2, "Hãy trao cho anh", "./assets/music/song4.mp3", "./assets/images/image4.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(5, 2, "Chạy ngay đi", "./assets/music/song5.mp3", "./assets/images/image5.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(6, 2, "Chúng ta của hiện tại", "./assets/music/song6.m4a", "./assets/images/image6.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(7, 5, "Là do em xui thôi", "./assets/music/song7.mp3", "./assets/images/image7.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(8, 5, "Hai đám mây", "./assets/music/song8.mp3", "./assets/images/image8.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(9, 6, "Chạy về khóc với anh", "./assets/music/song9.mp3", "./assets/images/image9.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(10, 7, "Tìm được nhau khó thế nào", "./assets/music/song10.mp3", "./assets/images/image10.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(11, 8, "Đế vương", "./assets/music/song11.mp3", "./assets/images/image11.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(12, 9, "Don't break my heart", "./assets/music/song12.mp3", "./assets/images/image12.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(13, 10, "Phía sau lưng anh có ai kìa", "./assets/music/song13.mp3", "./assets/images/image13.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(14, 1, "Still life", "./assets/music/song14.mp3", "./assets/images/image14.jpg");
insert into songs (s_id, singer_id, s_name, s_path, s_img_path)
        values(15, 11, "Hẹn ước từ hư vô", "./assets/music/song15.mp3", "./assets/images/image15.jpg");

insert into playlists (s_id, uid) values(14, 1);
insert into playlists (s_id, uid) values(1, 1);

-- procedure to signup
delimiter $$
create procedure signup(in username varchar(30), in passwd varchar(50))
begin
	if not exists (select uid FROM users u WHERE u.username = username)
		then
			INSERT INTO users(username, passwd) VALUES(username, passwd);
            select uid as res FROM users u WHERE u.username = username;
		else	
			select 0 as res;
	end if;
end; $$
delimiter ;

-- procedure to change password
delimiter $$
create procedure changePw(in uid int, in passwd varchar(50), in newPasswd varchar(50))
begin
	if exists (select * FROM users u WHERE u.uid = uid AND u.passwd = passwd)
		then
			UPDATE users SET users.passwd = newPasswd WHERE users.uid = uid AND users.passwd = passwd;
            select 1 as res;
		else	
			select 0 as res;
	end if;
end; $$
delimiter ;

-- procedure to delete a singers
delimiter $$
create procedure del_singer(in singer_id int)
begin
	if not exists (select singer_id from songs where songs.singer_id = singer_id)
		then
			DELETE FROM singers WHERE singers.singer_id = singer_id;
			select 1 as del;
		else	
			select 0 as del;
	end if;
end; $$
delimiter ;

-- procedure to delete a song
delimiter $$
create procedure del_song(in s_id int)
begin
	if exists (select s.s_id FROM songs s where s.s_id = s_id)
		then
            DELETE FROM playlists WHERE playlists.s_id = s_id;
            select 1 as del, s_path, s_img_path FROM songs WHERE songs.s_id = s_id;
			DELETE FROM songs WHERE songs.s_id = s_id;
		else	
			select 0 as del;
	end if;
end; $$
delimiter ;

-- procedure to delete a playlist song
delimiter $$
create procedure del_playlist_song(in s_id int, in uid int)
begin
	if exists (select s_id FROM playlists p WHERE p.s_id = s_id AND p.uid = uid)
		then
			DELETE FROM playlists WHERE playlists.s_id = s_id AND playlists.uid = uid;
            select 1 as del;
		else	
			select 0 as del;
	end if;
end; $$
delimiter ;
