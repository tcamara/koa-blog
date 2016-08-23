const www = module.exports = {};

// Set up user model
const Post = require('./../../../models/post.js');

www.index = function*() {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./routes.js');

	console.log(this.request.query);

	const postResults = yield Post.list();

	const posts = [];
	for(let i = 0; i < postResults.length; i++) {
		posts.push({
			id: postResults[i].id,
			title: postResults[i].title,
			slug: postResults[i].slug,
			user: postResults[i].author,
			timestamp: postResults[i].timestamp,
			edit_timestamp: postResults[i].edit_timestamp,
			content: postResults[i].content,
			href: postRoutes.url('show', postResults[i].id, postResults[i].slug),
		});
	}

	this.render('posts/list', {
		title: 'Posts',
		header: 'Posts',
		posts,
	});
};

www.new = function*() {
	// Need the router to be able to use named routes for the form action
	const postRoutes = require('./routes.js');

	this.render('posts/new', {
		title: 'New Post',
		header: 'New Post',
		content: 'testing',
		action: postRoutes.url('create')
	});
}

www.create = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	const params = this.request.body;

	// TODO: base this on current user
	const author = 1;
	const newPostId = yield Post.create(params.title, author, params.content);

	this.redirect(postRoutes.url('show', newPostId));
}

www.show = function*() {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./routes.js');

	const post = yield Post.get(this.params.id);

	if(typeof post != 'undefined') {
		this.render('posts/show', {
			header: post.title,
			id: post.id,
			title: post.title,
			slug: post.slug,
			user: post.author,
			timestamp: post.timestamp,
			edit_timestamp: post.edit_timestamp,
			content: post.content,
			href: postRoutes.url('show', post.id, post.slug),
		});
	}
	else { // the requested post is not defined, display the not found page
		this.render('posts/notFound', {
			header: 'Post Not Found',
		});
	}
}

www.update = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.update(this.params.id, this.params.title, this.params.author, this.params.content);

	this.redirect(postRoutes.url('show', this.params.id));
}

www.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.delete(this.params.id);

	this.redirect(postRoutes.url('index'));
}