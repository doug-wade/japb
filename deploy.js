var pg = require('pg')
  , fs = require('fs')
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
fs.readFile('./db/deploy.sql', { encoding:'utf8' }, function(err, queryString){
    if (err){
        console.log(err);
    }
    query = client.query(queryString);
    query.on('end', function() { client.end(); });
});
