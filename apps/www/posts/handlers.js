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
	this.render('posts/new', {
		title: 'New Post',
		header: 'New Post',
		content: 'testing',
	});
}

www.create = function*() {
	const params = this.request.body;

	// TODO: base this on current user
	const author = 1;
console.log('calling create');
	yield Post.create(params.title, author, params.content);
console.log('called create');

	this.render('index', {
		header: 'Create',
		content: 'testing',
	});
}

www.show = function*() {
	const post = yield Post.get(this.params.id);
	console.log('------------------');
	console.log(post);

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