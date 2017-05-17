const pageRouter = require('koa-router')();
const pageHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

pageRouter.get('new', '/new', pageHandler.newAction);
pageRouter.get('show', '/:pageId', pageHandler.showAction);
pageRouter.post('update', '/:pageId', pageHandler.updateAction);
pageRouter.delete('delete', '/:pageId', pageHandler.deleteAction);
pageRouter.get('index', '/', pageHandler.indexAction);
pageRouter.post('create', '/', pageHandler.createAction);

module.exports = pageRouter;
