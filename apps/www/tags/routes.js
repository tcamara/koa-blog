const tagRouter = require('koa-router')();
const tagHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

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
