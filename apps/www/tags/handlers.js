const tagHandler = module.exports = {};

// Set up tag model
const Tag = require('./../../../models/tag.js');
const Post = require('./../../../models/post.js');
const PostTag = require('./../../../models/postTag.js');

tagHandler.index = function*() {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./routes.js');

	const tagResults = yield Tag.get(
		this.request.query.page, 
		this.request.query.sort, 
		this.request.query.q
	);

	const tags = [];
	for(let tag of tagResults) {
		const tagLink = tagRoutes.url('show', tag.id, tag.slug);

		tags.push({
			id: tag.id,
			name: tag.name,
			slug: tag.slug,
			numPosts: tag.numPosts,
			href: tagLink,
		});
	}

	yield this.render('tags/list', {
		title: 'Tags',
		tags,
	});
};

tagHandler.new = function*() {
	// Need the router to be able to use named routes for the form action
	const tagRoutes = require('./routes.js');

	yield this.render('tags/new', {
		title: 'New Tag',
		action: tagRoutes.url('create')
	});
};

tagHandler.create = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	const newTagId = yield Tag.create(this.request.body.name);

	this.redirect(tagRoutes.url('show', newTagId));
};

tagHandler.show = function*() {
	const tag = yield Tag.getOneFormatted(this.params.tagId);

	if(tag != null) {
		const postIds = yield PostTag.getPostIdsByTag(tag.id);

		if(postIds.length) {
			const query = this.request.query;
			const posts = yield Post.getFormatted({
				page: query.page, 
				sort: query.sort, 
				customWhere: '`id` IN (' + postIds.join() + ')',
				fields: query.fields,
			});

			yield this.render('posts/list', {
				title: 'Posts Tagged ' + tag.name,
				posts,
			});
		}
		else {
			yield this.render('tags/noPosts', {
				title: 'No Posts Found',
			});
		}
	}
	else {
		yield this.render('tags/notFound', {
			title: 'Tag Not Found',
		});
	}
};

tagHandler.update = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	Tag.update(this.params.tagId, this.params.name);

	this.redirect(tagRoutes.url('show', this.params.tagId));
};

tagHandler.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	Tag.delete(this.params.tagId);

	this.redirect(tagRoutes.url('index'));
};

// TODO: index, but only within the given tag
tagHandler.post = function*() {
	const tag = yield Tag.getOneFormatted(this.params.tagId);

	const postIds = yield PostTag.getPostIdsByTag(tag.id);

	const query = this.request.query;
	const posts = yield Post.getFormatted({
		page: query.page, 
		sort: query.sort, 
		customWhere: '`id` IN (' + postIds.join() + ')',
		fields: query.fields,
	});

	yield this.render('posts/list', {
		title: 'Posts Tagged ' + tag.name,
		posts,
	});
};

// TODO: add a tag to a post
tagHandler.addPost = function*() {
	
};

// TODO: remove a tag from a post
tagHandler.removePost = function*() {
	
};