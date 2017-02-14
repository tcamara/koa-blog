const postHandler = module.exports = {};

const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let postRoutes = null;

postHandler.index = function*() {
	const query = this.request.query;
	const posts = yield PostModel.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	yield this.render('posts/list', {
		title: 'Posts',
		posts,
	});
};

postHandler.new = function*() {
	yield this.render('posts/new', {
		title: 'New Post',
		action: _getPostRoute('create'),
		hasEditor: true,
	});
};

postHandler.create = function*() {
	const params = this.request.body;

	// TODO: base this on current user
	const author = 1;
	const newPostId = yield PostModel.create(
		params.fields.title, 
		author, 
		params.fields.content, 
		params.files.image
	);

	this.redirect(_getPostRoute('show', newPostId));
};

postHandler.show = function*() {
	const post = yield PostModel.getOneFormatted(this.params.postId);

	yield this.render('posts/show', {
		title: post ? post.title : 'Post Not Found',
		post,
	});
};

postHandler.update = function*() {
	PostModel.update(
		this.params.postId, 
		this.params.title, 
		this.params.author, 
		this.params.content
	);

	this.redirect(_getPostRoute('show', this.params.postId));
};

postHandler.delete = function*() {
	PostModel.delete(this.params.postId);

	this.redirect(_getPostRoute('index'));
};

postHandler.addTag = function*() {
	PostTagModel.create(
		this.params.postId,
		this.params.tagId
	);
};

postHandler.removeTag = function*() {
	PostTagModel.delete(
		this.params.postId,
		this.params.tagId
	);
};

function _getPostRoute(...args) {
	if (postRoutes === null) {
		postRoutes = require('./routes.js');
	}

	return postRoutes.url(...args);
}