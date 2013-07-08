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

      deferred.resolve(result.rows[0].when);
    });
  });

  return deferred.promise;
}

exports.getPosts = function() {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('getAllPosts'), function(err, result) {
      handleError(err, deferred, done);

      done();

      deferred.resolve(result);
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

      deferred.resolve(result);
    });
  });

  return deferred.promise;
}

exports.createPost = function(postTitle, postText) {
  var deferred = Q.defer();

  console.log(insertQuery);

  pg.connect(dbUrl, function(err, client, done) {
    client.query(queries.getSqlQuery('addPost'), [postTitle, postText] function(err, result) {
      handleError(err, deferred, done);

      console.log(result.rows[0].id);

      done();

      deferred.resolve(result.rows[0].id);      
    });
  });

  return deferred.promise;
}

exports.deletePost = function(id){
  var deferred = Q.defer();
  
  console.log(deleteQuery);

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

      deferred.resolve(id);
    });
  });

  return deferred.promise;
}