const Router = require('koa-router');

const generalRouter = new Router();

const generalHandler = require('./handlers.js');

// Show home page
generalRouter.get('index', '/', generalHandler.index);

module.exports = generalRouter;