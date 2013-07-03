var pg = require('pg'),
    Q = require('q');

var dbUrl = "tcp://japbAdmin:34ae82ede2@localhost/japb";

exports.getDate = function(res, onDone) {
  var deferred = Q.defer();

  pg.connect(dbUrl, function(err, client, done) {
    var handleError = function(err) {
      if(!err) return false;
      done(client);
      deferred.reject(err);
      return true;
    };
    client.query("SELECT NOW() as when", function(err, result) {

      done();

      deferred.resolve(result.rows[0].when);
    });
  });

  return deferred.promise;
}
