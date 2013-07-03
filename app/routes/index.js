exports.index = function(req, res) {
  res.render('index', { title: 'Home', username: req.session.username });
};

exports.partials = function(req, res) {
  console.log('partials/' + name);
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.contact = function(req, res) {
  res.render('contact', { title: 'Contact', username: req.session.username });
};

exports.about = function(req, res) {
  res.render('about', { title: 'About', username: req.session.username });
};

exports.signin = function(req, res) {
  res.render('signin', { title: 'Signin', username: req.session.username });
};

