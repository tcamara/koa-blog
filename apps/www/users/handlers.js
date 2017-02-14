const userHandler = module.exports = {};

const UserModel = require('./../../../models/user.js');

let userRoutes = null;

userHandler.index = function*() {
	const query = this.request.query;
	const users = yield UserModel.getFormatted({
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
	yield this.render('users/new', {
		title: 'New User',
		action: _getUserRoute('create')
	});
};

userHandler.create = function*() {
	const newUserId = yield UserModel.create(
		this.request.body.name,
		this.request.body.email,
		this.request.body.password,
		this.request.body.bio
	);

	this.redirect(_getUserRoute('show', newUserId));
};

userHandler.show = function*() {
	const user = yield UserModel.getOneFormatted(this.params.userId);

	yield this.render('users/show', {
		title: user ? user.title : 'User Not Found',
		user,
	});
};

userHandler.update = function*() {
	UserModel.update(
		this.params.userId, 
		this.params.name,
		this.params.email,
		this.params.password,
		this.params.bio
	);

	this.redirect(_getUserRoute('show', this.params.userId));
};

userHandler.delete = function*() {
	UserModel.delete(this.params.userId);

	this.redirect(_getUserRoute('index'));
};

function _getUserRoute(...args) {
	if (userRoutes === null) {
		userRoutes = require('./routes.js');
	}

	return userRoutes.url(...args);
}