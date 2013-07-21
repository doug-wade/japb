begin;
create table jabp_user
(
	user_id serial primary key
	,username text
	,email_address text
	,pw_hash text
	,pw_hash_salt text
);
commit;

create table user_token
(
	user_id integer references jabp_user (user_id)
	,temporary_token text
	,token_expiry timestamp
);

create table user_permissions
(
	user_id integer references japb_user (user_id)
	,is_admin boolean
	,is_shadow_banned boolean
);

create table comments
(
	post_id integer references post (post_id)
	,user_id integer references japb_user (user_id)
	,comment_text text
	,is_hidden boolean
);

create table post
(
	post_id serial primary key
	,post_text text
	,post_title text
	,posted_by_id integer
);

create table tag
(
	tag_id serial primary key
	,tag_display_name text
);

create table map_post_to_tag
(
	tag_id integer references tag (tag_id)
	,post_id integer references post (post_id)
);

create function insert_user
(
	new_user_email text
	,new_username text
	,new_user_hash text
	,new_user_salt text
	,out new_user_id int
)
returns integer
as
$$ begin
insert into japb_user
(
	email_address
	,username
	,pw_hash
	,pw_hash_salt
)
values (new_user_email, new_username, new_user_hash, new_user_salt)
returning user_id into new_user_id;
end $$
language plpgsql;

create function update_user_password
(
	user_id int
	,updated_user_hash_pipe_salt text
	,temporary_token text
)
returns boolean
as
$$ begin
if exists (
	select user_id
	from japb_user
	inner join user_token
		on user_token.user_id = japb_user.user_id
	where temporary_token = user_token.temporary_token
		and japb_user.user_id = user_id
		and user_token.expiry_date < current_timestamp
)
then
	update japb_user
	set hash_pipe_salt = updated_user_hash_pipe_salt;
else
	delete
	from user_token
	where user_id = user_id;
end if;
end $$
language plpgsql;

create function insert_post
(
	new_post_title text
	,new_post_text text
	,out new_post_id int
)
returns integer
as
$$ begin
insert into post
(
	post_text
	,post_title
)
values (new_post_text, new_post_title)
returning post_id into new_post_id;
end $$
language plpgsql;

create function delete_post
(
	former_post_id int
)
returns void
as
$$ begin
delete from post
where post.post_id = former_post_id;
return;
end $$
language plpgsql;

create function update_post
(
	existing_post_id int
	,new_post_title text
	,new_post_text text
)
returns void
as
$$ begin
update post
set post_text = new_post_text
	,post_title = new_post_title
where post.post_id = existing_post_id;
return;
end $$
language plpgsql;