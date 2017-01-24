const userHandler = module.exports = {};

// Set up models
const User = require('./../../../models/user.js');

userHandler.index = function*() {
	const query = this.request.query;
	const users = yield User.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	yield this.render('users/list', {
		title: 'Users',
		users,
	});
};

userHandler.new = function*() {
	// Need the router to be able to use named routes for the form action
	const userRoutes = require('./routes.js');

	yield this.render('users/new', {
		title: 'New User',
		action: userRoutes.url('create')
	});
};

userHandler.create = function*() {
	// Need the router to be able to use named routes for redirecting
	const userRoutes = require('./routes.js');

	const newUserId = yield User.create(
		this.request.body.name,
		this.request.body.email,
		this.request.body.password,
		this.request.body.bio
	);

	this.redirect(userRoutes.url('show', newUserId));
};

userHandler.show = function*() {
	const user = yield User.getOneFormatted(this.params.userId);

	yield this.render('users/show', {
		title: user ? user.title : 'Post Not Found',
		user,
	});
};

userHandler.update = function*() {
	// Need the router to be able to use named routes for redirecting
	const userRoutes = require('./routes.js');

	User.update(
		this.params.userId, 
		this.params.name,
		this.params.email,
		this.params.password,
		this.params.bio
	);

	this.redirect(userRoutes.url('show', this.params.userId));
};

userHandler.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const userRoutes = require('./routes.js');

	User.delete(this.params.userId);

	this.redirect(userRoutes.url('index'));
};
