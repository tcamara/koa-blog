const userHandler = module.exports = {};

const UserModel = require('./../../../models/user.js');

let userRoutes = null;

userHandler.index = async (ctx, next) => {
	const query = ctx.request.query;
	
	const users = await UserModel.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	await ctx.render('users/list', {
		title: 'Users',
		users,
	});
};

userHandler.new = async (ctx, next) => {
	await ctx.render('users/new', {
		title: 'New User',
		action: _getUserRoute('create')
	});
};

userHandler.create = async (ctx, next) => {
	const newUserId = await UserModel.create(
		ctx.request.body.name,
		ctx.request.body.email,
		ctx.request.body.password,
		ctx.request.body.bio
	);

	ctx.redirect(_getUserRoute('show', newUserId));
};

userHandler.show = async (ctx, next) => {
	const user = await UserModel.getOneFormatted(ctx.params.userId);

	await ctx.render('users/show', {
		title: user ? user.title : 'User Not Found',
		user,
	});
};

userHandler.update = async (ctx, next) => {
	UserModel.update(
		ctx.params.userId, 
		ctx.params.name,
		ctx.params.email,
		ctx.params.password,
		ctx.params.bio
	);

	ctx.redirect(_getUserRoute('show', ctx.params.userId));
};

userHandler.delete = async (ctx, next) => {
	UserModel.delete(ctx.params.userId);

	ctx.redirect(_getUserRoute('index'));
};

function _getUserRoute(...args) {
	if (userRoutes === null) {
		userRoutes = require('./routes.js');
	}

	return userRoutes.url(...args);
}