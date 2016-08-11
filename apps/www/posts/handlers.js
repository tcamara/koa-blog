const www = module.exports = {};

// Set up user model
const Post = require('./../../../models/post.js');

www.index = function*() {
	const users = yield Post.list();
	console.log(users);

	this.render('index', {
		header: 'Index',
		content: 'testing',
	});
};

www.new = function*() {
	this.render('index', {
		header: 'New',
		content: 'testing',
	});
}

www.create = function*() {
	// Post.create(this.params.id);

	this.render('index', {
		header: 'Create',
		content: 'testing',
	});
}

www.show = function*() {
	const post = yield Post.get(this.params.id);

	this.render('index', {
		header: post.title,
		content: post.content,
	});
}

www.update = function*() {
	Post.update(this.params.id);

	this.render('index', {
		header: 'Update',
		content: 'testing',
	});
}

www.delete = function*() {
	Post.delete(this.params.id);

	this.render('index', {
		header: 'Delete',
		content: 'testing',
	});
}