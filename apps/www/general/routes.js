const Router = require('koa-router');

const generalRouter = new Router();

const www = require('./handlers.js');

// Show home page
generalRouter.get('index', '/', www.index);

// Show named page
generalRouter.get('page', '/:page', www.page);

module.exports = generalRouter;