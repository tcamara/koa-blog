const Router = require('koa-router');

const postRouter = new Router();

const www = require('./handlers.js');

// Show post list
postRouter.get('index', '/', www.index);

// Show create post page
postRouter.get('new', '/new', www.new);

// Create post submission
postRouter.post('create', '/create', www.create);

// Show single post
postRouter.get('show', '/:id/:slug?', www.show);

// Update post submission
postRouter.post('update', '/:id/update', www.update);

// Delete post submission
postRouter.post('delete', '/:id/delete', www.delete);

module.exports = postRouter;