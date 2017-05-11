const tagRouter = require('koa-router')();
const tagHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});

tagRouter.get('new', '/new', tagHandler.new);
tagRouter.get('show', '/:tagId/:slug?', tagHandler.show);
tagRouter.post('update', '/:tagId', koaBody, tagHandler.update);
tagRouter.delete('delete', '/:tagId', tagHandler.delete);
tagRouter.get('index', '/', tagHandler.index);
tagRouter.post('create', '/', koaBody, tagHandler.create);

module.exports = tagRouter;
