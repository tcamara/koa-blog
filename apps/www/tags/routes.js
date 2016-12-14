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

module.exports = tagRouter;