const www = module.exports = {};

// Set up tag model
const Tag = require('./../../../models/tag.js');

www.index = function*() {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./routes.js');

	const tagResults = yield Tag.list(
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
			num_posts: tag.num_posts,
			href: tagLink,
		});
	}

	yield this.render('tags/list', {
		title: 'Tags',
		header: 'Tags',
		tags,
	});
};

www.new = function*() {
	// Need the router to be able to use named routes for the form action
	const tagRoutes = require('./routes.js');

	yield this.render('tags/new', {
		title: 'New Tag',
		header: 'New Tag',
		action: tagRoutes.url('create')
	});
};

www.create = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	const newTagId = yield Tag.create(this.request.body.name);

	this.redirect(tagRoutes.url('show', newTagId));
};

www.show = function*() {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./routes.js');

	const tag = yield Tag.get(this.params.tagId);

	if(typeof tag != 'undefined') {
		yield this.render('tags/show', {
			header: tag.title,
			id: tag.id,
			title: tag.title,
			slug: tag.slug,
			user: tag.author,
			timestamp: tag.timestamp,
			edit_timestamp: tag.edit_timestamp,
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

www.update = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	Tag.update(this.params.tagId, this.params.name);

	this.redirect(tagRoutes.url('show', this.params.tagId));
};

www.delete = function*() {
	// Need the router to be able to use named routes for redirecting
	const tagRoutes = require('./routes.js');

	Tag.delete(this.params.tagId);

	this.redirect(tagRoutes.url('index'));
};

// TODO: index, but only within the given tag
www.tag = function*() {
	
};

// TODO: add a tag to a post
www.addTag = function*() {
	
};

// TODO: remove a tag from a post
www.removeTag = function*() {
	
};