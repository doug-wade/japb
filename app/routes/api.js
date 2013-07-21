/*
 * GET home page.
 */
var dataAccess = require('../data/dataAccess'),
    bcrypt = require('bcrypt'),
    secret = 'YOUR SECRET HERE';

function hash_pw(salt, pw){
  bcrypt.hash(salt, pw + secret, function(err, hash){
    if (err){
      return None;
    }
    return hash;
  });
}

function send_error(res, err){
  res.json({
    error: registrationError
  });
}

exports.registerUser = function(req, res){
  var hash, userId,
      registrationError = 'There was a problem with your registration.  Please try again.',
      pw = req.body.password,
      username = req.body.username;
  bcrypt.genSalt(function(err, salt){
    if (err){
      send_error(res, registrationError);
    }
    hash = hash_pw(salt, pw);
    if (hash){
      userId = dataAccess.registerUser(username, req.body.email, hash, salt);
      res.json({
        userId: userId,
        username: username
      });
    } else {
      send_error(res, registrationError);
    }
  });
}

exports.loginUser = function(req, res){
  salt 
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