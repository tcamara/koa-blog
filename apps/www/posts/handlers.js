const www = module.exports = {};

// Set up post model
const Post = require('./../../../models/post.js');

www.index = function*() {
	const query = this.request.query;
	const posts = yield Post.getFormatted({
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

www.new = function*() {
	// Need the router to be able to use named routes for the form action
	const postRoutes = require('./routes.js');

	yield this.render('posts/new', {
		title: 'New Post',
		action: postRoutes.url('create'),
		hasEditor: true,
	});
};

www.create = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	const params = this.request.body;

	// TODO: base this on current user
	const author = 1;
	const newPostId = yield Post.create(
		params.fields.title, 
		author, 
		params.fields.content, 
		params.files.image
	);

	this.redirect(postRoutes.url('show', newPostId));
};

www.show = function*() {
	const post = yield Post.getOneFormatted(this.params.postId);

	yield this.render('posts/show', {
		title: post ? post.title : 'Post Not Found',
		post,
	});
};

www.update = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.update(
		this.params.postId, 
		this.params.title, 
		this.params.author, 
		this.params.content
	);

	this.redirect(postRoutes.url('show', this.params.postId));
};

www.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.delete(this.params.postId);

	this.redirect(postRoutes.url('index'));
};

// TODO: index, but only within the given tag
www.tag = function*() {
	
};

// TODO: add a tag to a post
www.addTag = function*() {
	
};

// TODO: remove a tag from a post
www.removeTag = function*() {
	
};