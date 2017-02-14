const tagHandler = module.exports = {};

const TagModel = require('./../../../models/tag.js');
const PostModel = require('./../../../models/post.js');
const PostTagModel = require('./../../../models/postTag.js');

let tagRoutes = null;

tagHandler.index = function*() {
	const query = this.request.query;
	const tags = yield TagModel.getFormatted({
		page: query.page, 
		sort: query.sort, 
		query: query.q,
		fields: query.fields,
	});

	yield this.render('tags/list', {
		title: 'Tags',
		tags,
	});
};

tagHandler.new = function*() {
	yield this.render('tags/new', {
		title: 'New Tag',
		action: _getTagRoute('create')
	});
};

tagHandler.create = function*() {
	const newTagId = yield TagModel.create(this.request.body.name);

	this.redirect(_getTagRoute('show', newTagId));
};

tagHandler.show = function*() {
	const tag = yield TagModel.getOneFormatted(this.params.tagId);

	if (tag != null) {
		const postIds = yield PostTagModel.getPostIdsByTag(tag.id);
		let posts = null;

		if (postIds.length) {
			const query = this.request.query;
			posts = yield PostModel.getFormatted({
				page: query.page, 
				sort: query.sort, 
				customWhere: '`id` IN (' + postIds.join() + ')',
				fields: query.fields,
			});
		}

		yield this.render('posts/list', {
			title: posts ? ('Posts Tagged ' + tag.name) : 'No Posts Found',
			posts,
		});
	}
	else {
		yield this.render('tags/notFound', {
			title: 'Tag Not Found',
		});
	}
};

tagHandler.update = function*() {
	TagModel.update(this.params.tagId, this.params.name);

	this.redirect(_getTagRoute('show', this.params.tagId));
};

tagHandler.delete = function*() {
	TagModel.delete(this.params.tagId);

	this.redirect(_getTagRoute('index'));
};

function _getTagRoute(...args) {
	if (tagRoutes === null) {
		tagRoutes = require('./routes.js');
	}

	return tagRoutes.url(...args);
}