const postRouter = require('koa-router')();
const postHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

postRouter.get('new', '/new', postHandler.new);
postRouter.post('addTag', '/:postId/tags/:tagId', postHandler.addTag);
postRouter.delete('removeTag', '/:postId/tags/:tagId', postHandler.removeTag);
postRouter.get('show', '/:postId/:slug?', requireAuthentication, postHandler.show);
postRouter.post('update', '/:postId', koaBody, postHandler.update);
postRouter.delete('delete', '/:postId', postHandler.delete);
postRouter.get('index', '/', postHandler.index);
postRouter.post('create', '/', koaBody, postHandler.create);

module.exports = postRouter;

async function requireAuthentication(ctx, next) {
	if (ctx.isAuthenticated()) {
		await next();
	}
	else {
		ctx.redirect('/session');
	}
};