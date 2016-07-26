const www = module.exports = {};

// Set up user model
const User = require('./../../models/user.js');

www.index = function*() {
	const user = yield User.get('1');
	console.log(user);

	this.render('index', {
		header: 'Test',
		content: 'testing',
	});
};