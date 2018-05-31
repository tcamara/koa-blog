const TagModel = require('./../../../models/tag.js');
const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let tagRoutes = null;

async function indexAction(ctx, next) {
	const tags = await TagModel.getFormatted({
		page: ctx.request.query.page,
		sort: ctx.request.query.sort,
		query: ctx.request.query.q,
		fields: ctx.request.query.fields,
	});

	await ctx.render('tags/list', {
		title: 'Tags',
		tags,
	});
}

async function newAction(ctx, next) {
	await ctx.render('tags/new', {
		title: 'New Tag',
		action: _getTagRoute('create'),
	});
}

async function createAction(ctx, next) {
	const newTagId = await TagModel.create(ctx.request.body.name);

	ctx.redirect(_getTagRoute('show', newTagId));
}

async function showAction(ctx, next) {
	const tag = await TagModel.getOneFormatted(ctx.params.tagId);

	if (tag != null) {
		const postIds = await PostTagModel.getPostIdsByTag(tag.id);
		let posts = null;

		if (postIds.length) {
			posts = await PostModel.getFormatted({
				page: ctx.request.query.page,
				sort: ctx.request.query.sort,
				customWhere: `\`id\` IN (${postIds.join()})`,
				fields: ctx.request.query.fields,
			});
		}

		await ctx.render('posts/list', {
			title: posts ? `Posts Tagged ${tag.name}` : 'No Posts Found',
			posts,
		});
	}
	else {
		await ctx.render('tags/notFound', {
			title: 'Tag Not Found',
		});
	}
}

async function updateAction(ctx, next) {
	TagModel.update(ctx.params.tagId, ctx.params.name);

	ctx.redirect(_getTagRoute('show', ctx.params.tagId));
}

async function deleteAction(ctx, next) {
	TagModel.remove(ctx.params.tagId);

	ctx.redirect(_getTagRoute('index'));
}

function _getTagRoute(...args) {
	if (tagRoutes === null) {
		tagRoutes = require('./routes.js');
	}

	return tagRoutes.url(...args);
}

module.exports = {
	indexAction,
	newAction,
	createAction,
	showAction,
	updateAction,
	deleteAction,
};
