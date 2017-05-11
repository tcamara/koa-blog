const generalHandler = module.exports = {};

let generalRoutes = null;

generalHandler.index = async (ctx, next) => {
	await ctx.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};

generalHandler.new = async (ctx, next) => {
	await ctx.render('general/login', {
		title: 'Login',
		action: _getGeneralRoute('create'),
		googleAuthLink: _getGeneralRoute('createGoogle'),
	});
};

generalHandler.create = async (ctx, next) => {
	const params = ctx.request.body;
	
	ctx.redirect(_getGeneralRoute('index'));
};

generalHandler.delete = async (ctx, next) => {
	ctx.redirect(_getGeneralRoute('index'));
};

function _getGeneralRoute(...args) {
	if (generalRoutes === null) {
		generalRoutes = require('./routes.js');
	}

	return generalRoutes.url(...args);
}