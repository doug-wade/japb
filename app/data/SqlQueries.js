var insertQuery =   'insert into post ' +
			        '( ' +
			        '    post_title ' +
			        '   ,post_text ' +
			        ') ' +
			        'values ($1, $2) ' +
			        'returning post_id;';
var updateQuery = 	'update post ' +
			        'set post_title = $1 ' +
			        '   ,post_text = $2 ' +
			        'where post.post_id = $3;';

var sqlQueryDict = {
  'getDate': 'SELECT NOW() as when',
  'getAllPosts': 'select post_id as "id", post_title as "title", post_text as "text" from post',
  'getPostById': 'select post_id as "id", post_title as "title", post_text as "text" from post where post_id = $1',
  'addPost': insertQuery,
  'deletePost': 'delete from post where post.post_id = $1;',
  'updatePost': updateQuery
};

var getSqlQuery = function(queryName){
  return sqlQueryDict[queryName];
};

exports.getSqlQuery = getSqlQuery;