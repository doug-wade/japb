var pg = require('pg');

var dbUrl = "tcp://japbAdmin:34ae82ede2@localhost/japb";

exports.getDate = function(onDone) {
    pg.connect(dbUrl, function(err, client) {
        client.query("SELECT NOW() as when", function(err, result) {
            console.log("Row count: %d",result.rows.length);  // 1
            console.log("Current year: %d", result.rows[0].when.getFullYear());

            onDone();
        });
    });
}
