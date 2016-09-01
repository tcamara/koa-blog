const Router = require('koa-router');

const postRouter = new Router();

const www = require('./handlers.js');

// Show post list
postRouter.get('index', '/', www.index);

// Show create post page
postRouter.get('new', '/new', www.new);

// Create post submission
postRouter.post('create', '/', www.create);

// Show single post
postRouter.get('show', '/:postId/:slug?', www.show);

// Update post submission
postRouter.post('update', '/:postId', www.update);

// Delete post submission
postRouter.delete('delete', '/:postId', www.delete);

// Get posts by tag
postRouter.get('tag', '/tags/:tagId', www.tag);

// Add tag to post
postRouter.post('addTag', '/:postId/tags/:tagId', www.addTag);

// Remove tag from post
postRouter.delete('removeTag', '/:postId/tags/:tagId', www.removeTag);

module.exports = postRouter;