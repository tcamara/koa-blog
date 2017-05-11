const postHandler = module.exports = {};

const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let postRoutes = null;

postHandler.index = async (ctx, next) => {
	const query = ctx.request.query;
	const posts = await PostModel.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	await ctx.render('posts/list', {
		title: 'Posts',
		posts,
	});
};

postHandler.new = async (ctx, next) => {
	await ctx.render('posts/new', {
		title: 'New Post',
		action: _getPostRoute('create'),
		hasEditor: true,
	});
};

postHandler.create = async (ctx, next) => {
	const params = ctx.request.body;
	const author = ctx.req.user.id;

	const newPostId = await PostModel.create(
		params.fields.title, 
		author, 
		params.fields.content, 
		params.files.image
	);

	ctx.redirect(_getPostRoute('show', newPostId));
};

postHandler.show = async (ctx, next) => {
	const post = await PostModel.getOneFormatted(ctx.params.postId);

	await ctx.render('posts/show', {
		title: post ? post.title : 'Post Not Found',
		post,
	});
};

postHandler.update = async (ctx, next) => {
	PostModel.update(
		ctx.params.postId, 
		ctx.params.title, 
		ctx.params.author, 
		ctx.params.content
	);

	ctx.redirect(_getPostRoute('show', ctx.params.postId));
};

postHandler.delete = async (ctx, next) => {
	PostModel.delete(ctx.params.postId);

	ctx.redirect(_getPostRoute('index'));
};

postHandler.addTag = async (ctx, next) => {
	PostTagModel.create(
		ctx.params.postId,
		ctx.params.tagId
	);
};

postHandler.removeTag = async (ctx, next) => {
	PostTagModel.delete(
		ctx.params.postId,
		ctx.params.tagId
	);
};

function _getPostRoute(...args) {
	if (postRoutes === null) {
		postRoutes = require('./routes.js');
	}

	return postRoutes.url(...args);
}