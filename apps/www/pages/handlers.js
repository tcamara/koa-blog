const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let pageRoutes = null;

async function indexAction(ctx, next) {
	const query = ctx.request.query;
	const pages = await PostModel.getFormatted({
		page: query.page,
		sort: query.sort,
		query: query.q,
		fields: query.fields,
	});

	await ctx.render('posts/list', {
		title: 'Pages',
		pages,
	});
};

async function newAction(ctx, next) {
	await ctx.render('posts/new', {
		title: 'New Page',
		action: _getPageRoute('create'),
		hasEditor: true,
	});
};

async function createAction(ctx, next) {
	const params = ctx.request.body;
	const author = ctx.req.user.id;

	const newPageId = await PostModel.create(
		params.fields.title,
		author,
		params.fields.content,
		params.files.image
	);

	ctx.redirect(_getPageRoute('show', newPageId));
};

async function showAction(ctx, next) {
	const page = await PostModel.getOneFormatted(ctx.params.pageId);

	await ctx.render('posts/show', {
		title: page ? page.title : 'Page Not Found',
		page,
	});
};

async function updateAction(ctx, next) {
	PostModel.update(
		ctx.params.pageId,
		ctx.params.title,
		ctx.params.author,
		ctx.params.content
	);

	ctx.redirect(_getPageRoute('show', ctx.params.pageId));
};

async function deleteAction(ctx, next) {
	PostModel.remove(ctx.params.pageId);

	ctx.redirect(_getPageRoute('index'));
};

async function addTagAction(ctx, next) {
	PostTagModel.create(
		ctx.params.pageId,
		ctx.params.tagId
	);
};

async function removeTagAction(ctx, next) {
	PostTagModel.remove(
		ctx.params.pageId,
		ctx.params.tagId
	);
};

function _getPageRoute(...args) {
	if (pageRoutes === null) {
		pageRoutes = require('./routes.js');
	}

	return pageRoutes.url(...args);
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
