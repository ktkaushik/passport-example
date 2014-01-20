
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res) {
	res.render('login', {title: 'Login'});
};


exports.succ = function(req, res) {
	res.render('succ', {title: 'Successful'});
};