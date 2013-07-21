var pg = require('pg'),
    Q = require('q'),
    queries = require('./SqlQueries');

var dbUrl = "tcp://japbAdmin:34ae82ede2@localhost/japb";

var handleError = function(err, deferred, done) {
  if(!err) return false;
  done();
  deferred.reject(err);
  return true;
};

exports.getDate = function() {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('getDate'), function(err, result) {
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        now: result.rows[0].when
      });
    });
  });

  return deferred.promise;
}

exports.getPosts = function() {
  var posts = [],
      deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('getAllPosts'), function(err, result) {
      handleError(err, deferred, done);

      done();
      console.log(result.rows);
      result.rows.forEach(function(post, i){
        console.log(post);
        posts.push({
          id: post.id,
          title: post.title,
          teaser: post.text.substr(0,50) + '...',
          text: post.text
        });
      });

      deferred.resolve({
        posts: posts
      });
    });
  });

  return deferred.promise;
}

exports.getPost = function(id) {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('getPostById'), [id], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        post: result.rows[0]
      });
    });
  });

  return deferred.promise;
}

exports.createPost = function(postTitle, postText) {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('addPost'), [postTitle, postText], function(err, result) {
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        post_id: result.rows[0].post_id
      });
    });
  });

  return deferred.promise;
}

exports.deletePost = function(id){
  var deferred = Q.defer();
  
  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('deletePost'), [id], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve();
    });
  });

  return deferred.promise;
}

exports.editPost = function(id, postTitle, postText){
  var deferred = Q.defer();
  
  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('updatePost'), [postTitle, postText, id], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        post_id: id
      });
    });
  });

  return deferred.promise;
}

exports.registerUser = function(username, email, hash, salt){
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done){
    client.query(queries.getSqlQuery('insertUser'), [email, username, hash, salt], function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve({
        user_id: result.rows[0].user_id
      });
    });
  });
}

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