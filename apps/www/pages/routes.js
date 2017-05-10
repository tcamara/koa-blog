const pageRouter = require('koa-router')();
const pageHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

// Show page list
pageRouter.get('index', '/', pageHandler.index);

// Show create page page
pageRouter.get('new', '/new', pageHandler.new);

// Create page submission
pageRouter.post('create', '/', pageHandler.create);

// Show single page
pageRouter.get('show', '/:pageId', pageHandler.show);

// Update page submission
pageRouter.post('update', '/:pageId', pageHandler.update);

// Delete page submission
pageRouter.delete('delete', '/:pageId', pageHandler.delete);

module.exports = pageRouter;