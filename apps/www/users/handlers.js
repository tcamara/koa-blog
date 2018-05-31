const UserModel = require('./../../../models/user.js');

let userRoutes = null;

async function indexAction(ctx, next) {
	const users = await UserModel.getFormatted({
		page: ctx.request.query.page,
		sort: ctx.request.query.sort,
		query: ctx.request.query.q,
		fields: ctx.request.query.fields,
	});

	await ctx.render('users/list', {
		title: 'Users',
		users,
	});
}

async function newAction(ctx, next) {
	await ctx.render('users/new', {
		title: 'New User',
		action: _getUserRoute('create'),
	});
}

async function createAction(ctx, next) {
	const newUserId = await UserModel.create(
		ctx.request.body.name,
		ctx.request.body.email,
		ctx.request.body.password,
		ctx.request.body.bio,
	);

	ctx.redirect(_getUserRoute('show', newUserId));
}

async function showAction(ctx, next) {
	const user = await UserModel.getOneFormatted(ctx.params.userId);

	await ctx.render('users/show', {
		title: user ? user.title : 'User Not Found',
		user,
	});
}

async function updateAction(ctx, next) {
	UserModel.update(
		ctx.params.userId,
		ctx.params.name,
		ctx.params.email,
		ctx.params.password,
		ctx.params.bio,
	);

	ctx.redirect(_getUserRoute('show', ctx.params.userId));
}

async function deleteAction(ctx, next) {
	UserModel.remove(ctx.params.userId);

	ctx.redirect(_getUserRoute('index'));
}

function _getUserRoute(...args) {
	if (userRoutes === null) {
		userRoutes = require('./routes.js');
	}

	return userRoutes.url(...args);
}

module.exports = {
	indexAction,
	newAction,
	createAction,
	showAction,
	updateAction,
	deleteAction,
};
