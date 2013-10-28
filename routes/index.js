
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// module.exports = function() {

// 	console.log('message');
// 	var users = {};

// 	users.some = function(){
// 		// res.render('index', { title: 'Express' });
// 		console.log('inside index');
// 	};

// 	return users;

// };