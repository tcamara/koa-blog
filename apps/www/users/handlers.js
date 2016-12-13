const userHandler = module.exports = {};

// Set up user model
// const User = require('./../../models/user.js');

userHandler.index = function*() {
	// const user = yield User.get('1');
	// console.log(user);

	this.render('index', {
		header: 'Index',
		content: 'testing',
	});
};

userHandler.new = function*() {
	this.render('index', {
		header: 'New',
		content: 'testing',
	});
};

userHandler.create = function*() {
	this.render('index', {
		header: 'Create',
		content: 'testing',
	});
};

userHandler.show = function*() {
	this.render('index', {
		header: 'Show',
		content: 'testing',
	});
};

userHandler.update = function*() {
	this.render('index', {
		header: 'Update',
		content: 'testing',
	});
};

userHandler.delete = function*() {
	this.render('index', {
		header: 'Delete',
		content: 'testing',
	});
};