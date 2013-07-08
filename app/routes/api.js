/*
 * GET home page.
 */
var dataAccess = require('../data/dataAccess');

exports.posts = function(req, res){
  var posts = [];
  dataAccess.getPosts()
  .then(function(data){
    data.rows.forEach(function(post, i){
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
  var id = req.params.id;

  dataAccess.getPost(id)
  .then(function(data){
    var postRow = data.rows[0];
    res.json({
      post: postRow
    });
  });
};

exports.addPost = function(req, res){
  dataAccess.createPost(req.body.title, req.body.text).
  then(function(data){
    res.json({ id: data.id });
  }, function(error){
    res.json({ error: error });
  });
};

exports.editPost = function(req, res){
  var id = req.params.id;

  dataAccess.editPost(id, req.body.title, req.body.text).
  then(function(data){
    console.log(JSON.stringify(data));
    res.json({ id: JSON.stringify(data) });
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
  .then(function(dateResult){ 
    res.json({ date: dateResult }); 
  }, function(error){
    res.json({ error: error });
  });
};