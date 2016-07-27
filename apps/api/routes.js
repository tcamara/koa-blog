const router = require('koa-router')();

const api = require('./handlers.js');

router.get('/', api.index);

module.exports = router;