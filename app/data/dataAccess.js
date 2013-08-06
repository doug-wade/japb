var pg = require('pg'),
    Q = require('q'),
    queries = require('./SqlQueries'),
    dbUrl = "tcp://japbAdmin:34ae82ede2@localhost/japb";

/**
* @ngdoc function
* @name handleError
* @function
*
* @description An internal function that handles an error from a SQL query.
* @param {string} err An error string returned from Postgres
* @param {object} deferred An Q.deferred object to be returned to the invoking method.
* @param {function} done A function to be invoked when the query is completed.
* @returns {boolean} false if there was an error, true otherwise.
*/
var handleError = function(err, deferred, done) {
  if(!err) {
    return false;
  }

  done();
  deferred.reject(err);

  return true;
};

/**
* @ngdoc function
* @name formatResults
* @function
*
* @description An internal function that formats the results of SQL queries
* @param {object} results The results object returned from Postgres
* @returns {dictionary} A correctly formatted JSON object.
*/
var formatResults = function(result, queryName) {
  switch(queryName){
    //Dates
    case 'getDate':
      return { now: result.rows[0].when };

    //Posts
    case 'addPost':
      return { post_id: result.rows[0].insert_post };

    case 'getPostById':
      return { post: result.rows[0] };

    case 'getAllPosts':
      var posts = [];
      result.rows.forEach(function(post){
        posts.push({
          id: post.id,
          title: post.title,
          teaser: post.text.substr(0,50) + '...',
          text: post.text
        });
      });
      return { posts: posts };

    case 'updatePost':
      return { post_id: result.rows[0].updated_post_id };

    //Users
    case 'checkEmail':
      return { exists: result.rows[0].email_exists };

    case 'checkUsername':
      return { exists: result.rows[0].username_exists };

    case 'getUser':
      console.log(result);
      return { user_id: result.rows[0].user_id, 
               username: result.rows[0].username,
               accessLevel: result.rows[0].access_level };

    case 'insertUser':
      var new_user_id = result.rows[0].insert_user;

      if (new_user_id == 0){
        deferred.resolve({ error: 'Insert failed.' });
      }

      return { user_id: new_user_id, username: username };

    default:
      return { error: 'An unknown SQL query was called.' };
  }
};

/**
* @ngdoc function
* @name executeSqlQuery
* @function
*
* @description Executes a Sql Query against the database.
* @param {object} deferred A Q.defer() returned to the invoking method.
* @param {array} args An array of arguements to pass to the Sql query.
* @returns {object} A promise, which is resolved once the JSON is formatted.
*/
var executeSqlQuery = function(queryName, args) {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery(queryName), args, function(err, result) {
      handleError(err, deferred, done);

      done();

      deferred.resolve(formatResults(result, queryName));
    });
  });

  return deferred.promise;
};

/**
* @ngdoc function
* @name getDate
* @function
*
* @description A test function to get the date and time.
* @returns {datetime} The current date and time.
*/
exports.getDate = function() {
  return executeSqlQuery('getDate');
}

/**
* @ngdoc function
* @name getPosts
* @function
*
* @description Gets all posts.
* @returns {array} An array of all the posts.
*/
exports.getPosts = function() {
  return executeSqlQuery('getAllPosts');
}

/**
* @ngdoc function
* @name getPostById
* @function
*
* @description Gets a single post.
* @param {integer} id The id of the post to return.
* @returns {object} A post object.
*/
exports.getPost = function(id) {
  return executeSqlQuery('getPostById', [id]);
}

/**
* @ngdoc function
* @name createPost
* @function
*
* @description Creates a post in the database.
* @param {string} postTitle The title of the post.
* @param {string} postText The full text of the post.
* @returns {integer} The id of the post that was created.
*/
exports.createPost = function(postTitle, postText) {
  return executeSqlQuery('addPost', [postTitle, postText]);
}

/**
* @ngdoc function
* @name deletePost
* @function
*
* @description Deletes a post from the database.
* @param {integer} id The id of the post to delete from the database.
* @returns {void}
*/
exports.deletePost = function(id){
  return executeSqlQuery('deletePost', [id]);
}

/**
* @ngdoc function
* @name editPost
* @function
*
* @description Edits a post in the database.
* @param {integer} id The id of the post to edit.
* @param {string} postTitle The updated title of the post.
* @param {string} postText The updated text of the post.
* @returns {integer} The id of the post that was edited.
*/
exports.editPost = function(id, postTitle, postText){
  return executeSqlQuery('updatePost', [postTitle, postText, id]);
}

/**
* @ngdoc function
* @name registerUser
* @function
*
* @description Registers a new user in the database.
* @param {string} username The new user's username.
* @param {string} email The new user's email address.
* @param {string} hash The hash of the user's password, including cycles and salt.
* @returns {object} The new user's username and user_id.
*/
exports.registerUser = function(username, email, hash){
  return executeSqlQuery('insertUser', [email, username, hash]);
}

/**
* @ngdoc function
* @name checkEmail
* @function
*
* @description Checks to see if an email address already exists.
* @param {string} email_address The email address to check.
* @returns {boolean} True if the email exists, False otherwise.
*/
exports.checkEmail = function(email_address){
  return executeSqlQuery('checkEmail', [email_address]);
}

/**
* @ngdoc function
* @name checkUsername
* @function
*
* @description Checks to see if an username already exists.
* @param {string} username The username to check.
* @returns {boolean} True if the username exists, False otherwise.
*/
exports.checkUsername = function(username){
  return executeSqlQuery('checkUsername', [username]);
}

/**
* @ngdoc function
* @name loginUser
* @function
*
* @description Gets the user information for a given login 
* @param {string} login A username or email address
* @returns {object} The user's information.
*/
exports.loginUser = function(login){
  console.log('dataccess got login: ' + login);
  return executeSqlQuery('getUser', [login]);
}