const tagHandler = module.exports = {};

// Set up tag model
const Tag = require('./../../../models/tag.js');

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
		header: 'Tags',
		tags,
	});
};

tagHandler.new = function*() {
	// Need the router to be able to use named routes for the form action
	const tagRoutes = require('./routes.js');

	yield this.render('tags/new', {
		title: 'New Tag',
		header: 'New Tag',
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
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./routes.js');

	const tag = yield Tag.getOne(this.params.tagId);

	if(typeof tag != 'undefined') {
		yield this.render('tags/show', {
			header: tag.title,
			id: tag.id,
			title: tag.title,
			slug: tag.slug,
			user: tag.author,
			timestamp: tag.timestamp,
			editTimestamp: tag.editTimestamp,
			content: tag.content,
			href: tagRoutes.url('show', tag.id, tag.slug),
		});
	}
	else { // the requested tag is not defined, display the not found page
		yield this.render('tags/notFound', {
			header: 'Tag Not Found',
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
tagHandler.tag = function*() {
	
};

// TODO: add a tag to a post
tagHandler.addTag = function*() {
	
};

// TODO: remove a tag from a post
tagHandler.removeTag = function*() {
	
};