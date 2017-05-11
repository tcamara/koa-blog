const userRouter = require('koa-router')();
const userHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

userRouter.get('new', '/new', userHandler.new);
userRouter.get('show', '/:userId/:slug?', userHandler.show);
userRouter.post('update', '/:userId', koaBody, userHandler.update);
userRouter.delete('delete', '/:userId', userHandler.delete);
userRouter.get('index', '/', userHandler.index);
userRouter.post('create', '/', koaBody, userHandler.create);

module.exports = userRouter;
