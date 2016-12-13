const postHandler = module.exports = {};

// Set up post model
const Post = require('./../../../models/post.js');

postHandler.index = function*() {
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

postHandler.new = function*() {
	// Need the router to be able to use named routes for the form action
	const postRoutes = require('./routes.js');

	yield this.render('posts/new', {
		title: 'New Post',
		action: postRoutes.url('create'),
		hasEditor: true,
	});
};

postHandler.create = function*() {
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

postHandler.show = function*() {
	const post = yield Post.getOneFormatted(this.params.postId);

	yield this.render('posts/show', {
		title: post ? post.title : 'Post Not Found',
		post,
	});
};

postHandler.update = function*() {
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

postHandler.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.delete(this.params.postId);

	this.redirect(postRoutes.url('index'));
};

// TODO: query the tag first, then the associated posts
postHandler.tag = function*() {
	const query = this.request.query;
	const posts = yield Post.getFormatted({
		page: query.page, 
		sort: query.sort, 
		filter: {
			'tagId': this.params.tagId,
			'slug': this.params.slug
		},
		fields: query.fields,
	});

	yield this.render('posts/list', {
		title: 'Posts Tagged ',
		posts,
	});
};

// TODO: add a tag to a post
postHandler.addTag = function*() {
	
};

// TODO: remove a tag from a post
postHandler.removeTag = function*() {
	
};