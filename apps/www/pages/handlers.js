const pageHandler = module.exports = {};

const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let pageRoutes = null;

pageHandler.index = async (ctx, next) => {
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

pageHandler.new = async (ctx, next) => {
	await ctx.render('posts/new', {
		title: 'New Page',
		action: _getPageRoute('create'),
		hasEditor: true,
	});
};

pageHandler.create = async (ctx, next) => {
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

pageHandler.show = async (ctx, next) => {
	const page = await PostModel.getOneFormatted(ctx.params.pageId);

	await ctx.render('posts/show', {
		title: page ? page.title : 'Page Not Found',
		page,
	});
};

pageHandler.update = async (ctx, next) => {
	PostModel.update(
		ctx.params.pageId, 
		ctx.params.title, 
		ctx.params.author, 
		ctx.params.content
	);

	ctx.redirect(_getPageRoute('show', ctx.params.pageId));
};

pageHandler.delete = async (ctx, next) => {
	PostModel.delete(ctx.params.pageId);

	ctx.redirect(_getPageRoute('index'));
};

pageHandler.addTag = async (ctx, next) => {
	PostTagModel.create(
		ctx.params.pageId,
		ctx.params.tagId
	);
};

pageHandler.removeTag = async (ctx, next) => {
	PostTagModel.delete(
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