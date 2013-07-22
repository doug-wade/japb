/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , api = require('./routes/api');

var app = express();

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/css' }));
  app.use(app.router);
  app.use(express.static(__dirname));
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

app.listen(3000, function(){
  console.log("Express server listening on port %d", app.get('port'));
});
