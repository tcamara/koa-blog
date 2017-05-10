const userRouter = require('koa-router')();
const userHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

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