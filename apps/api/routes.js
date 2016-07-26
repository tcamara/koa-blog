const router = require('koa-router');

var apiRouter = new router({
	prefix: '/api',
});
console.log('inside api');
const api = require('./handlers.js');

apiRouter.get('/', api.index);

module.exports = apiRouter.middleware();