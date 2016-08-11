const www = module.exports = {};

// Set up user model
// const User = require('./../../models/user.js');

www.index = function*() {
	// const user = yield User.get('1');
	// console.log(user);

	this.render('index', {
		header: 'Index',
		content: 'testing',
	});
};

www.new = function*() {
	this.render('index', {
		header: 'New',
		content: 'testing',
	});
}

www.create = function*() {
	this.render('index', {
		header: 'Create',
		content: 'testing',
	});
}

www.show = function*() {
	this.render('index', {
		header: 'Show',
		content: 'testing',
	});
}

www.update = function*() {
	this.render('index', {
		header: 'Update',
		content: 'testing',
	});
}

www.delete = function*() {
	this.render('index', {
		header: 'Delete',
		content: 'testing',
	});
}