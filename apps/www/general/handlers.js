const generalHandler = module.exports = {};

let generalRoutes = null;

generalHandler.index = function*() {
	// TODO: figure out why this isn't an actual user object once you're logged in
	console.log(this.req.user);

	yield this.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};

generalHandler.new = function*() {
	yield this.render('general/login', {
		title: 'Login',
		action: _getGeneralRoute('create'),
	});
};

generalHandler.create = function*() {
	const params = this.request.body;
	
	this.redirect(_getGeneralRoute('index'));
};

generalHandler.delete = function*() {
	this.redirect(_getGeneralRoute('index'));
};

function _getGeneralRoute(...args) {
	if (generalRoutes === null) {
		generalRoutes = require('./routes.js');
	}

	return generalRoutes.url(...args);
}