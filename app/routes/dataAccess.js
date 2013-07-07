var pg = require('pg'),
    Q = require('q');

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
    client.query("SELECT NOW() as when", function(err, result) {
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
    client.query('select post_id as "id", post_title as "title", post_text as "text" from post', function(err, result) {
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
    client.query('select post_id as "id", post_title as "title", post_text as "text" from post where post_id = ' + id, function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve(result);
    });
  });

  return deferred.promise;
}

exports.createPost = function(postTitle, postText) {
  var deferred = Q.defer(),
      insertQuery = "insert into post " +
        " ( " +
        "    post_title " +
        "   ,post_text " +
        " ) " +
        " values ('" + postTitle + "', '"  + postText + "') " +
        " returning post_id;";

  console.log(insertQuery);

  pg.connect(dbUrl, function(err, client, done) {
    client.query(insertQuery, function(err, result) {
      handleError(err, deferred, done);

      console.log(result.rows[0].id);

      done();

      deferred.resolve(result.rows[0].id);      
    });
  });

  return deferred.promise;
}

exports.deletePost = function(id){
  var deferred = Q.defer(),
      deleteQuery = "delete from post where post.post_id = " + id + ";";
  
  console.log(deleteQuery);

  pg.connect(dbUrl, function(err, client, done){
    client.query(deleteQuery, function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve();
    });
  });

  return deferred.promise;
}

exports.editPost = function(id, postTitle, postText){
  var deferred = Q.defer(),
      updateQuery = "update post " +
        "  set post_text = '" + postText + "' " +
        "  ,post_title = '" + postTitle + "' " +
        "where post.post_id = " + id + ";";
  
  console.log(updateQuery);

  pg.connect(dbUrl, function(err, client, done){
    client.query(updateQuery, function(err, result){
      handleError(err, deferred, done);

      done();

      deferred.resolve(id);
    });
  });

  return deferred.promise;
}