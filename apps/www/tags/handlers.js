const tagHandler = module.exports = {};

const TagModel = require('./../../../models/tag.js');
const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let tagRoutes = null;

tagHandler.index = async (ctx, next) => {
	const query = ctx.request.query;
	const tags = await TagModel.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	await ctx.render('tags/list', {
		title: 'Tags',
		tags,
	});
};

tagHandler.new = async (ctx, next) => {
	await ctx.render('tags/new', {
		title: 'New Tag',
		action: _getTagRoute('create')
	});
};

tagHandler.create = async (ctx, next) => {
	const newTagId = await TagModel.create(ctx.request.body.name);

	ctx.redirect(_getTagRoute('show', newTagId));
};

tagHandler.show = async (ctx, next) => {
	const tag = await TagModel.getOneFormatted(ctx.params.tagId);

	if (tag != null) {
		const postIds = await PostTagModel.getPostIdsByTag(tag.id);
		let posts = null;

		if (postIds.length) {
			const query = ctx.request.query;
			posts = await PostModel.getFormatted({
				page: query.page, 
				sort: query.sort, 
				customWhere: '`id` IN (' + postIds.join() + ')',
				fields: query.fields,
			});
		}

		await ctx.render('posts/list', {
			title: posts ? ('Posts Tagged ' + tag.name) : 'No Posts Found',
			posts,
		});
	}
	else {
		await ctx.render('tags/notFound', {
			title: 'Tag Not Found',
		});
	}
};

tagHandler.update = async (ctx, next) => {
	TagModel.update(ctx.params.tagId, ctx.params.name);

	ctx.redirect(_getTagRoute('show', ctx.params.tagId));
};

tagHandler.delete = async (ctx, next) => {
	TagModel.delete(ctx.params.tagId);

	ctx.redirect(_getTagRoute('index'));
};

function _getTagRoute(...args) {
	if (tagRoutes === null) {
		tagRoutes = require('./routes.js');
	}

	return tagRoutes.url(...args);
}