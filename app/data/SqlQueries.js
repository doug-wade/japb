var sqlQueryDict = {
  'getDate': 'SELECT NOW() as when',
  'getAllPosts': 'select post_id as "id", post_title as "title", post_text as "text" from post',
  'getPostById': 'select post_id as "id", post_title as "title", post_text as "text" from post where post_id = $1',
  'addPost': 'select insert_post($1, $2);',
  'deletePost': 'select delete_post($1);',
  'updatePost': 'select update_post($3, $1, $2);',
  'insertUser': 'select insert_user($1, $2, $3);',
  'getUser': 'select pw_hash as "hash", pw_hash_salt as "salt", user_id as "user_id" from japb_user where username = $1 or email_address = $1;',
  'updateUserPassword': 'select update_user_password($1, $2, $3);'
};

var getSqlQuery = function(queryName){
  return sqlQueryDict[queryName];
};

exports.getSqlQuery = getSqlQuery;