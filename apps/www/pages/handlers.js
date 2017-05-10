const pageHandler = module.exports = {};

// Set up post model
const Post = require('./../../../models/post.js');

pageHandler.index = async (ctx, next) => {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./routes.js');

	const postResults = await Post.list(
		ctx.request.query.page, 
		ctx.request.query.sort, 
		ctx.request.query.q
	);

	const posts = [];
	for(let i = 0; i < postResults.length; i++) {
		const postLink = postRoutes.url('show', postResults[i].id, postResults[i].slug);

		posts.push({
			id: postResults[i].id,
			title: postResults[i].title,
			slug: postResults[i].slug,
			user: postResults[i].author,
			timestamp: postResults[i].timestamp,
			editTimestamp: postResults[i].editTimestamp,
			content: postResults[i].content,
			href: postLink,
		});
	}

	await ctx.render('posts/list', {
		title: 'Posts',
		header: 'Posts',
		posts,
	});
};

pageHandler.new = async (ctx, next) => {
	// Need the router to be able to use named routes for the form action
	const postRoutes = require('./routes.js');

	await ctx.render('posts/new', {
		title: 'New Post',
		header: 'New Post',
		content: 'testing',
		action: postRoutes.url('create')
	});
};

pageHandler.create = async (ctx, next) => {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	const params = ctx.request.body;

	// TODO: base this on current user
	const author = 1;
	const newPostId = await Post.create(params.title, author, params.content);

	ctx.redirect(postRoutes.url('show', newPostId));
};

pageHandler.show = async (ctx, next) => {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./routes.js');

	const post = await Post.get(ctx.params.id);

	if(typeof post != 'undefined') {
		await ctx.render('posts/show', {
			header: post.title,
			id: post.id,
			title: post.title,
			slug: post.slug,
			user: post.author,
			timestamp: post.timestamp,
			editTimestamp: post.editTimestamp,
			content: post.content,
			href: postRoutes.url('show', post.id, post.slug),
		});
	}
	else { // the requested post is not defined, display the not found page
		await ctx.render('posts/notFound', {
			header: 'Post Not Found',
		});
	}
};

pageHandler.update = async (ctx, next) => {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.update(
		ctx.params.id, 
		ctx.params.title, 
		ctx.params.author, 
		ctx.params.content
	);

	ctx.redirect(postRoutes.url('show', ctx.params.id));
};

pageHandler.delete = async (ctx, next) => {
	// Need the router to be able to use named routes for redirecting
	const postRoutes = require('./routes.js');

	Post.delete(ctx.params.id);

	ctx.redirect(postRoutes.url('index'));
};