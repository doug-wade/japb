exports.index = function(req, res) {
  res.render('index', { title: 'Home', username: req.session.username });
};

exports.partials = function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name, { title: name, username: req.session.username });
};