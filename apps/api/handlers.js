const api = module.exports = {};

// Set up user model
const User = require('./../../models/user.js');

api.index = function*() {
	const user = yield User.get('1');
	console.log(user);

	this.render('index', {
		header: 'API Test',
		content: 'API testing',
	});
};