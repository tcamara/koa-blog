const postRouter = require('koa-router')();
const postHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true,
});

postRouter.get('new', '/new', postHandler.newAction);
postRouter.post('addTag', '/:postId/tags/:tagId', postHandler.addTagAction);
postRouter.delete('removeTag', '/:postId/tags/:tagId', postHandler.removeTagAction);
postRouter.get('show', '/:postId/:slug?', requireAuthentication, postHandler.showAction);
postRouter.post('update', '/:postId', koaBody, postHandler.updateAction);
postRouter.delete('delete', '/:postId', postHandler.deleteAction);
postRouter.get('index', '/', postHandler.indexAction);
postRouter.post('create', '/', koaBody, postHandler.createAction);

module.exports = postRouter;

async function requireAuthentication(ctx, next) {
	if (ctx.isAuthenticated()) {
		await next();
	}
	else {
		ctx.redirect('/session');
	}
}
