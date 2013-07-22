/*
 * GET home page.
 */
var dataAccess = require('../data/dataAccess'),
    bcrypt = require('bcrypt'),
    Q = require('q'),
    secret = 'YOUR SECRET HERE';

function hash_pw(salt, pw){
  var deferred = Q.defer();

  bcrypt.hash(pw + secret, salt, function(err, hash){
    if (err){
      deferred.reject(err);
    }
    deferred.resolve({hash: hash});
  });

  return deferred.promise;
}

function send_error(res, err){
  res.json({
    error: err
  });
}

exports.registerUser = function(req, res){
  var hash, userId,
      registrationError = 'There was a problem with your registration.  Please try again.',
      pw = req.body.password,
      username = req.body.username;
  bcrypt.genSalt(function(err, salt){
    if (err){
      console.log(err);
      send_error(res, registrationError);
    }
    hash_pw(salt, pw).
    then(function(data){
      dataAccess.registerUser(username, req.body.email, data.hash).
      then(function(data){
        console.log('Attempting to send json...');
        res.json({
          userId: data.user_id,
          username: data.username
        });
      });
    }).
    catch(function(err){
      console.log(err);
      send_error(res, registrationError);
    });
  });
}

exports.loginUser = function(req, res){
  var salt = '';
}

exports.posts = function(req, res){
  var posts = [];
  dataAccess.getPosts()
  .then(function(data){
    data.posts.forEach(function(post, i){
      posts.push({
        id: post.id,
        title: post.title,
        teaser: post.text.substr(0,50) + '...',
        text: post.text
      });
    });
    res.json({
      posts: posts
    });
  }, function(err){
    res.json(JSON.stringify(err));
  });
};

exports.post = function(req, res){
  var postRow, id = req.params.id;

  dataAccess.getPost(id)
  .then(function(data){
    postRow = data.post;
    res.json({
      post: postRow
    });
  });
};

exports.addPost = function(req, res){
  dataAccess.createPost(req.body.title, req.body.text).
  then(function(data){
    res.json({ id: data.post_id });
  }, function(error){
    res.json({ error: error });
  });
};

exports.editPost = function(req, res){
  var id = req.params.id;

  dataAccess.editPost(id, req.body.title, req.body.text).
  then(function(data){
    res.json({ id: JSON.stringify(data.post_id) });
  });
};

exports.deletePost = function(req, res){
  var id = req.params.id;

  dataAccess.deletePost(id).
  then(function(){
    res.json({ id: id });
  }, function(error){
    res.json({ error: error });
  });
};

exports.getDate = function(req, res){
  dataAccess.getDate()
  .then(function(data){ 
    res.json({ date: data.now }); 
  }, function(error){
    res.json({ error: error });
  });
};