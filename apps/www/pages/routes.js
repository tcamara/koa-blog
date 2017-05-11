const pageRouter = require('koa-router')();
const pageHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

pageRouter.get('new', '/new', pageHandler.new);
pageRouter.get('show', '/:pageId', pageHandler.show);
pageRouter.post('update', '/:pageId', pageHandler.update);
pageRouter.delete('delete', '/:pageId', pageHandler.delete);
pageRouter.get('index', '/', pageHandler.index);
pageRouter.post('create', '/', pageHandler.create);

module.exports = pageRouter;
