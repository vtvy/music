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
    s_path varchar(100) not null,
    s_img_path varchar(100) not null,
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
------------------------------------------------------------
-- insert value
insert into playlists (s_id, uid) values(7, 1);
insert into playlists (s_id, uid) values(8, 1);
insert into playlists (s_id, uid) values(10, 1);


------------------------------------------------------------
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

-- procedure to delete a songs
delimiter $$
create procedure del_song(in s_id int)
begin
	if exists (select s.s_id FROM songs s where s.s_id = s_id)
		then
            select 1 as del, s.s_path, s.s_img_path FROM songs s where s.s_id = s_id;
			DELETE FROM songs WHERE songs.s_id = s_id;
		else	
			select 0 as del;
	end if;
end; $$
delimiter ;
