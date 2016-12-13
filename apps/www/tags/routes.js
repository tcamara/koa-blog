const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});

const tagRouter = new Router();

const tagHandler = require('./handlers.js');

// Show tag list
tagRouter.get('index', '/', tagHandler.index);

// Show create tag page
tagRouter.get('new', '/new', tagHandler.new);

// Create tag submission
tagRouter.post('create', '/', koaBody, tagHandler.create);

// Show single tag
tagRouter.get('show', '/:tagId/:slug?', tagHandler.show);

// Update tag submission
tagRouter.post('update', '/:tagId', koaBody, tagHandler.update);

// Delete tag submission
tagRouter.delete('delete', '/:tagId', tagHandler.delete);

// Get posts by tag
tagRouter.get('tag', '/:tagId/posts', tagHandler.tag);

// Add tag to post
tagRouter.post('addTag', '/:tagId/posts/:postId', tagHandler.addTag);

// Remove tag from post
tagRouter.delete('removeTag', '/:tagId/posts/:postId', tagHandler.removeTag);

module.exports = tagRouter;