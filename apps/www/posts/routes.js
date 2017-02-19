const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});

const passport = require('./../../../auth/auth.js');

const postRouter = new Router();

const postHandler = require('./handlers.js');

// Show post list
postRouter.get('index', '/', postHandler.index);

// Show create post page
postRouter.get('new', '/new', postHandler.new);

// Create post submission
postRouter.post('create', '/', koaBody, postHandler.create);

// Add tag to post
postRouter.post('addTag', '/:postId/tags/:tagId', postHandler.addTag);

// Remove tag from post
postRouter.delete('removeTag', '/:postId/tags/:tagId', postHandler.removeTag);

// Show single post
postRouter.get('show', '/:postId/:slug?', requireAuthentication, postHandler.show);

// Update post submission
postRouter.post('update', '/:postId', koaBody, postHandler.update);

// Delete post submission
postRouter.delete('delete', '/:postId', postHandler.delete);

module.exports = postRouter;

function* requireAuthentication(next) {
	if (this.isAuthenticated()) {
		yield next;
	}
	else {
		this.redirect('/session');
	}
};