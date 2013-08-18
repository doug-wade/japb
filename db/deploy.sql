CREATE TABLE japb_user
(
	user_id SERIAL PRIMARY KEY
	,username TEXT
	,email_address TEXT
	,pw_hash TEXT
	,access_level INTEGER
);

CREATE TABLE user_token
(
	user_id INTEGER REFERENCES japb_user (user_id)
	,temporary_token TEXT
	,token_expiry TIMESTAMP
);

CREATE TABLE comments
(
	post_id INTEGER REFERENCES post (post_id)
	,user_id INTEGER REFERENCES japb_user (user_id)
	,comment_text TEXT
	,is_hidden BOOLEAN
);

CREATE TABLE post
(
	post_id SERIAL PRIMARY KEY
	,post_text TEXT
	,post_title TEXT
	,posted_by_id INTEGER
);

CREATE TABLE tag
(
	tag_id SERIAL PRIMARY KEY
	,tag_display_name TEXT
);

CREATE TABLE map_post_to_tag
(
	tag_id INTEGER REFERENCES tag (tag_id)
	,post_id INTEGER REFERENCES post (post_id)
);

CREATE FUNCTION insert_user
(
	new_user_email TEXT
	,new_username TEXT
	,new_user_hash TEXT
	,out new_user_id INTEGER
)
RETURNS INTEGER
AS
$$ BEGIN
DECLARE email_used BOOLEAN;
DECLARE username_used BOOLEAN;
BEGIN
	SELECT check_username(new_username) INTO username_used;
	SELECT check_email(new_user_email) INTO email_used;
	IF new_user_email = '' OR new_username = '' OR new_user_hash = '' OR email_used OR username_used
	THEN
		SELECT 0 INTO new_user_id;
	ELSE
		INSERT INTO japb_user
		(
			email_address
			,username
			,pw_hash
		)
		VALUES (new_user_email, new_username, new_user_hash)
		RETURNING user_id INTO new_user_id;
	END IF;
END;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION check_username
(
	username_to_check TEXT
)
RETURNS BOOLEAN
AS
$$ BEGIN
IF EXISTS (
	SELECT user_id
	FROM japb_user
	WHERE japb_user.username = username_to_check
)
THEN
	RETURN True AS "username_exists";
ELSE
	RETURN False AS "username_exists";
END IF;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION check_email
(
	email_adress_to_check TEXT
)
RETURNS BOOLEAN
AS
$$ BEGIN
IF EXISTS (
	SELECT user_id
	FROM japb_user
	WHERE japb_user.email_address = email_adress_to_check
)
THEN
	RETURN True AS "email_exists";
ELSE
	RETURN False AS "email_exists";
END IF;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION update_user_password
(
	user_id INTEGER
	,updated_user_hash_pipe_salt TEXT
	,temporary_token TEXT
)
RETURNS BOOLEAN
AS
$$ BEGIN
IF EXISTS (
	SELECT user_id
	FROM japb_user
	INNER JOIN user_token
		ON user_token.user_id = japb_user.user_id
	WHERE temporary_token = user_token.temporary_token
		AND japb_user.user_id = user_id
		AND user_token.expiry_date < current_timestamp
)
THEN
	UPDATE japb_user
	SET hash_pipe_salt = updated_user_hash_pipe_salt;
ELSE
	DELETE
	DELETE user_token
	WHERE user_id = user_id;
END IF;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION insert_post
(
	new_post_title TEXT
	,new_post_TEXT TEXT
	,out new_post_id int
)
RETURNS INTEGER
AS
$$ BEGIN
INSERT INTO post
(
	post_text
	,post_title
)
VALUES (new_post_text, new_post_title)
RETURNING post_id INTO new_post_id;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION delete_post
(
	former_post_id int
	,out post_deleted BOOLEAN
)
RETURNS BOOLEAN
AS
$$ BEGIN
DELETE FROM post
WHERE post.post_id = former_post_id;
post_deleted := found;
RETURN;
END $$
LANGUAGE PLPGSQL;

CREATE FUNCTION update_post
(
	existing_post_id int
	,new_post_title TEXT
	,new_post_TEXT TEXT
	,out updated_post_id INTEGER
)
RETURNS INTEGER
AS
$$ BEGIN
UPDATE post
SET post_TEXT = new_post_text
	,post_title = new_post_title
WHERE post.post_id = existing_post_id;
IF FOUND
THEN
	updated_post_id := existing_post_id;
ELSE
	updated_post_id := 0;
END IF;
RETURN;
END $$
LANGUAGE PLPGSQL;