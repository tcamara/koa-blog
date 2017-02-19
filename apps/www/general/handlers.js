const generalHandler = module.exports = {};

// const PostModel = require('./../../../models/post.js');
// const PostTagModel = require('./../../../models/postTag.js');

let generalRoutes = null;

generalHandler.index = function*() {
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
	console.log(params);

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