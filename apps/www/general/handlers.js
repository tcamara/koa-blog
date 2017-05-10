const generalHandler = module.exports = {};

let generalRoutes = null;

generalHandler.index = async (ctx, next) => {
	// TODO: figure out why this isn't an actual user object once you're logged in
	console.log(ctx.req.user);

	await ctx.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};

generalHandler.new = async (ctx, next) => {
	await ctx.render('general/login', {
		title: 'Login',
		action: _getGeneralRoute('create'),
		googleAuthLink: _getGeneralRoute('create-google'),
	});
};

generalHandler.create = async (ctx, next) => {
	const params = ctx.request.body;
	
	ctx.redirect(_getGeneralRoute('index'));
};

generalHandler.delete = async (ctx, next) => {
	ctx.redirect(_getGeneralRoute('index'));
};

// TODO: Figure out what to do about https://github.com/alexmingoia/koa-router/issues/351
function _getGeneralRoute(...args) {
	if (generalRoutes === null) {
		generalRoutes = require('./routes.js');
	}

	return generalRoutes.url(...args);
}