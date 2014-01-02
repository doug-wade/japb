/**
 * Module dependencies.
 */

var fs = require('fs')
  , express = require('express')
  , routes = require('./routes/index')
  , api = require('./routes/api')
  , stylus = require('stylus');

var today = new Date();
var loggingStream = fs.createWriteStream('./logs/' + today.toDateString() + '-express-logs.txt');

var app = express();

// Configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set(express.favicon(__dirname + '/public/favicon.ico'));
  
  app.use(express.logger('dev'));

  // Middleware
  // Prevent cross-site scripting
  // app.use(express.csrf('my secret here.'));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded());

  // Authentication middleware
  //app.use(express.basicAuth(function(req, res, next) { 
  //  next();
  //  return true; 
  //}));

  // Logging middleware
  app.use(express.logger({ stream: loggingStream }));

  app.use(express.cookieParser(process.env.COOKIESECRET || 'your secret here'));
  app.use(express.session({ secret: process.env.SESSIONSECRET || 'your secret here'}));
  app.use(stylus.middleware({ src: __dirname + '/public/css' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public/'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.use(routes.index);
app.get('/partials/:name', routes.partials);
app.use(routes.partials);

//JSON API
app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);
app.get('/api/date', api.getDate);
app.post('/api/user/register', api.registerUser);
app.post('/api/user/login', api.loginUser)

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", app.get('port'));
});
