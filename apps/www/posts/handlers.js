const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let postRoutes = null;

async function indexAction(ctx, next) {
	const posts = await PostModel.getFormatted({
		page: ctx.request.query.page,
		sort: ctx.request.query.sort,
		query: ctx.request.query.q,
		fields: ctx.request.query.fields,
	});

	await ctx.render('posts/list', {
		title: 'Posts',
		posts,
	});
}

async function newAction(ctx, next) {
	await ctx.render('posts/new', {
		title: 'New Post',
		action: _getPostRoute('create'),
		hasEditor: true,
	});
}

async function createAction(ctx, next) {
	const params = ctx.request.body;
	const author = ctx.req.user.id;

	const newPostId = await PostModel.create(
		params.fields.title,
		author,
		params.fields.content,
		params.files.image,
	);

	ctx.redirect(_getPostRoute('show', newPostId));
}

async function showAction(ctx, next) {
	const post = await PostModel.getOneFormatted(ctx.params.postId);

	await ctx.render('posts/show', {
		title: post ? post.title : 'Post Not Found',
		post,
	});
}

async function updateAction(ctx, next) {
	PostModel.update(
		ctx.params.postId,
		ctx.params.title,
		ctx.params.author,
		ctx.params.content,
	);

	ctx.redirect(_getPostRoute('show', ctx.params.postId));
}

async function deleteAction(ctx, next) {
	PostModel.remove(ctx.params.postId);

	ctx.redirect(_getPostRoute('index'));
}

async function addTagAction(ctx, next) {
	PostTagModel.create(
		ctx.params.postId,
		ctx.params.tagId,
	);
}

async function removeTagAction(ctx, next) {
	PostTagModel.remove(
		ctx.params.postId,
		ctx.params.tagId,
	);
}

function _getPostRoute(...args) {
	if (postRoutes === null) {
		postRoutes = require('./routes.js');
	}

	return postRoutes.url(...args);
}

module.exports = {
	indexAction,
	newAction,
	createAction,
	showAction,
	updateAction,
	deleteAction,
	addTagAction,
	removeTagAction,
};
