const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});

const userRouter = new Router();

const userHandler = require('./handlers.js');

// Show user list
userRouter.get('index', '/', userHandler.index);

// Show create user page (Registration)
userRouter.get('new', '/new', userHandler.new);

// Create user submission
userRouter.post('create', '/', koaBody, userHandler.create);

// Show single user
userRouter.get('show', '/:userId/:slug?', userHandler.show);

// Update user submission
userRouter.post('update', '/:userId', koaBody, userHandler.update);

// Delete user submission
userRouter.delete('delete', '/:userId', userHandler.delete);

module.exports = userRouter;