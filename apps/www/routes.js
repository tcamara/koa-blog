const router = require('koa-router')();

const www = require('./handlers.js');

router.get('/', www.index);

module.exports = router.middleware();