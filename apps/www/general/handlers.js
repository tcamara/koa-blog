let generalRoutes = null;

async function indexAction(ctx, next) {
	await ctx.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
}

async function newAction(ctx, next) {
	await ctx.render('general/login', {
		title: 'Login',
		action: _getGeneralRoute('create'),
		googleAuthLink: _getGeneralRoute('createGoogle'),
	});
}

async function createAction(ctx, next) {
	ctx.redirect(_getGeneralRoute('index'));
}

async function deleteAction(ctx, next) {
	ctx.request.logout();
	ctx.redirect(_getGeneralRoute('index'));
}

function _getGeneralRoute(...args) {
	if (generalRoutes === null) {
		generalRoutes = require('./routes.js');
	}

	return generalRoutes.url(...args);
}

module.exports = {
	indexAction,
	newAction,
	createAction,
	deleteAction,
};
