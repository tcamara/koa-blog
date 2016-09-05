const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});

const tagRouter = new Router();

const www = require('./handlers.js');

// Show tag list
tagRouter.get('index', '/', www.index);

// Show create tag page
tagRouter.get('new', '/new', www.new);

// Create tag submission
tagRouter.post('create', '/', koaBody, www.create);

// Show single tag
tagRouter.get('show', '/:tagId/:slug?', www.show);

// Update tag submission
tagRouter.post('update', '/:tagId', koaBody, www.update);

// Delete tag submission
tagRouter.delete('delete', '/:tagId', www.delete);

// Get posts by tag
tagRouter.get('tag', '/:tagId/posts', www.tag);

// Add tag to post
tagRouter.post('addTag', '/:tagId/posts/:postId', www.addTag);

// Remove tag from post
tagRouter.delete('removeTag', '/:tagId/posts/:postId', www.removeTag);

module.exports = tagRouter;