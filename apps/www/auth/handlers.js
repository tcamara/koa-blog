const authHandler = module.exports = {};

// const PostModel = require('./../../../models/post.js');
// const PostTagModel = require('./../../../models/postTag.js');

let authRoutes = null;

authHandler.google = function*() {
	// const query = this.request.query;
	// const posts = yield PostModel.getFormatted({
	// 	page: query.page, 
	// 	sort: query.sort, 
	// 	query: query.q,
	// 	fields: query.fields,
	// });

	// yield this.render('posts/list', {
	// 	title: 'Posts',
	// 	posts,
	// });
};

authHandler.googleCallback = function*() {
	// yield this.render('posts/new', {
	// 	title: 'New Post',
	// 	action: _getPostRoute('create'),
	// 	hasEditor: true,
	// });
};

function _getAuthRoute(...args) {
	if (authRoutes === null) {
		authRoutes = require('./routes.js');
	}

	return authRoutes.url(...args);
}