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
        console.log(post);
        posts.push({
          id: post.id,
          title: post.title,
          teaser: post.text.substr(0,50) + '...',
          text: post.text
        });
      });
      return { posts: posts };

    case 'updatePost':
      console.log(result.rows);
      return { post_id: result.rows[0].updated_post_id };

    default:
      return { err: 'An unknown SQL query was called.' }
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
* @ngdoc
* @name
* @function
*
* @description 
* @param
* @returns
*/
exports.registerUser = function(username, email, hash){
  var new_user_id, 
      deferred = Q.defer();

  console.log('Saving user to db...', username, email, hash);

  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('insertUser'), [email, username, hash], function(err, result){
      handleError(err, deferred, done);

      done();

      new_user_id = result.rows[0].insert_user;

      console.log('new_user_id: ', new_user_id);

      if (new_user_id == 0){
        deferred.reject('Insert failed.');
      }

      deferred.resolve({
        user_id: new_user_id,
        username: username
      });
    });
  });

  return deferred.promise;
}

/**
* @ngdoc
* @name
* @function
*
* @description 
* @param
* @returns
*/
exports.checkEmail = function(email_address){
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('checkEmail'), [email_address], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        exists: result.rows[0].email_exists
      });

    });
  });
}

/**
* @ngdoc
* @name
* @function
*
* @description 
* @param
* @returns
*/
exports.checkUsername = function(username){
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('checkUsername'), [username], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        exists: result.rows[0].username_exists
      });

    });
  });
}

/**
* @ngdoc
* @name
* @function
*
* @description 
* @param
* @returns
*/
exports.loginUser = function(login){
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('getUser'), [login], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve();
    });
  });
}