/*
 * GET home page.
 */
var dataAccess = require('./dataAccess');
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      "title": "Sed egestas",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};

exports.posts = function(req, res) {
  var posts = [];
  data.posts.forEach(function(post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0,50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function(req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

exports.addPost = function(req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

exports.editPost = function(req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.deletePost = function(req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.getDate = function(req, res) {
  var dateResult = dataAccess.getDate(undefined);
  
  res.json({ date: dateResult });
}
