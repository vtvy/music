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
    s_path varchar(50) not null,
    s_img_path varchar(50) not null,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key(s_id),
    foreign key(singer_id) references singers(singer_id)
);

-- create playlist table
create table playlists(
	pid int auto_increment,
    s_id int,
    uid int,
    createdAt datetime default CURRENT_TIMESTAMP,
    primary key (pid),
	foreign key(s_id) references songs(s_id),
    foreign key(uid) references users(uid)
);

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

-- procedure to create a post
delimiter $$
create procedure add_post (in title varchar(50), in postText varchar(50),  in v_UID int)
begin
	if exists (select UID from users where users.UID = v_UID)
		then
			insert into posts(title, postText, UID) values (title, postText, v_UID);
            select PID as id from posts p where p.title = title and p.postText = postText and p.UID = v_UID;
		else	
			select 0 as id;
	end if;
end; $$
delimiter ;

-- count number like of a post
delimiter $$
create function get_like_of(PID int)
	returns int
begin
	declare cnt int default -1;
    if exists (select ps.PID from posts ps where ps.PID=PID)
		then
			select count(PID) into cnt from likes where likes.PID=PID;
	end if;
    return cnt;
end; $$
delimiter ;

-- get username of UID (Dong)
delimiter $$
create function get_username_of(UID int)
	returns varchar(30)
begin
	declare uname varchar(30) default "";
    if exists (select u.UID from users u where u.UID=UID)
		then
			select userName into uname from users u where u.UID=UID;
	end if;
    return uname;
end; $$
delimiter ;

-- count number cmt of a post (Vy)
delimiter $$
create function get_cmt_of(PID int)
	returns int
begin
	declare cnt int default -1;
    if exists (select ps.PID from posts ps where ps.PID=PID)
		then
			select count(PID) into cnt from comments c where c.PID=PID;
	end if;
    return cnt;
end; $$
delimiter ;

-- procedure to show all posts (Dong)
delimiter $$
create procedure listPost(in UserId int)
begin
	select p.PID, p.title, p.postText as pText, p.UID as id, get_username_of(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    order by p.updatedAt desc;
end; $$
delimiter ;

-- procedure to show a post by PID (Vy)
delimiter $$
create procedure getPostByID(in UserId int, in PID int)
begin
    select p.PID, p.title, p.postText as pText, p.UID as id, get_username_of(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    where p.PID = PID;
end; $$
delimiter ;

-- procedure to delete a post (Dong)
delimiter $$
create procedure delete_post(in PID int, in UID int)
begin
	DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;
	if exists (select p.UID from posts p where p.PID = PID and p.UID = UID)
		then
			set autocommit = 0;
			start transaction;
			delete from comments where comments.PID = PID;
			delete from likes where likes.PID = PID;
			delete from posts where posts.PID = PID;
			commit;
            set autocommit = 1;
            select 1 as id;
		else
			select 0 as id;
	end if;
end; $$
delimiter ;

-- procedure to add a comment (Dong)
delimiter $$
create procedure add_cmt (in cText varchar(500), in PID int, in v_UID int)
begin
		insert into comments(cmtText, PID, UID) values (cText, PID, v_UID);
        select CID as cmtId from comments c where c.cmtText = cText and c.PID = PID and c.UID = v_UID;
end; $$
delimiter ;

-- procedure to show all comments of a post (Vy)
delimiter $$
create procedure list_cmt_of(in PID int)
begin
	select CID as cmtId, cmtText as cText, c.UID as id, get_username_of(c.UID) as Username
    from comments c
    where c.PID=PID
    order by c.updatedAt;
end; $$
delimiter ;

-- procedure delete a comment (Vy)
delimiter $$
create procedure delete_cmt(in CID int)
begin
	delete from comments where comments.CID=CID;
end; $$
delimiter ;

-- function to react a post (Dong)
delimiter $$
create function act_like(PID int, UID int)
	returns int
begin
    if not exists (select l.PID from likes l where l.PID = PID and l.UID=UID)
		then
			insert into likes(PID, UID) values (PID, UID);
            return 1;
		else																		
			delete from likes where likes.PID=PID and likes.UID=UID;
			return -1;
	end if;
end; $$
delimiter ;

-- procedure to show all post by UID (Dong)
delimiter $$
create procedure getPostByUserID(in UserId int, in v_UID int)
begin
    select p.PID, p.title, p.postText as pText, p.UID as id, get_username_of(p.UID) as pusername,
    get_like_of(p.PID) as numLike, get_cmt_of(p.PID) as numCmt,
    case 
		when exists (select UID from likes where UID = UserId and PID = p.PID)
			then 1
        else 0
	end	as isLike
    from posts p
    where p.UID = v_UID;
end; $$
delimiter ;

-- procedure to change password (Vy)
delimiter $$
create procedure update_password(in UID int, in newpasswd varchar(500))
begin
    if exists (select UID from users u where u.UID=UID)
		then
			update users u set u.passwd=newpasswd, u.updatedAt=now() where u.UID=UID;
	end if; 
end; $$
delimiter ;

-- procedure to show all deleted posts of a user (Dong)
delimiter $$
create procedure get_deleted_posts(in UserId int)
begin
    select d.PID, d.title, d.postText as dText
    from posts_deleted d
    where d.UID = UserId;
end; $$
delimiter ;

-- procedure to delete permanently a post from posts_deleted (Dong)
delimiter $$
create procedure delete_post_permant(in PID int, in UID int)
begin
    delete from posts_deleted
    where posts_deleted.UID = UID and posts_deleted.PID = PID;
end; $$
delimiter ;

-- procedure to edit a post (Vy)
delimiter $$
create procedure update_post(in PID int, in title varchar(50), in postText varchar(500))
begin
	update posts set posts.title=title, posts.postText=postText, posts.updatedAt=now()
    where posts.PID=PID;
end; $$
delimiter ;


