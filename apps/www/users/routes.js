const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});

const postRouter = new Router();

const www = require('./handlers.js');

// Show post list
postRouter.get('/', www.index);

// Show create post page
postRouter.get('/new', www.new);

// Create post submission
postRouter.post('/create', koaBody, www.create);

// Show single post
postRouter.get('/:id', www.show);

// Update post submission
postRouter.post('/:id/update', koaBody, www.update);

// Delete post submission
postRouter.post('/:id/delete', www.delete);

module.exports = postRouter;