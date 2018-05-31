const tagRouter = require('koa-router')();
const tagHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true,
});

tagRouter.get('new', '/new', tagHandler.newAction);
tagRouter.get('show', '/:tagId/:slug?', tagHandler.showAction);
tagRouter.post('update', '/:tagId', koaBody, tagHandler.updateAction);
tagRouter.delete('delete', '/:tagId', tagHandler.deleteAction);
tagRouter.get('index', '/', tagHandler.indexAction);
tagRouter.post('create', '/', koaBody, tagHandler.createAction);

module.exports = tagRouter;
