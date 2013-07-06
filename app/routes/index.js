exports.index = function(req, res) {
  res.render('index', { title: 'Home', username: req.session.username });
};

exports.partials = function(req, res) {
  var name = req.params.name;
  console.log('partials/' + name);
  res.render('partials/' + name);
  //It would be nice if I could successfully include more stuff:
  //res.render('partials/' + name, { title: name, username: req.session.username });
};