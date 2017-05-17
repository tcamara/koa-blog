const userRouter = require('koa-router')();
const userHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

userRouter.get('new', '/new', userHandler.newAction);
userRouter.get('show', '/:userId/:slug?', userHandler.showAction);
userRouter.post('update', '/:userId', koaBody, userHandler.updateAction);
userRouter.delete('delete', '/:userId', userHandler.deleteAction);
userRouter.get('index', '/', userHandler.indexAction);
userRouter.post('create', '/', koaBody, userHandler.createAction);

module.exports = userRouter;
