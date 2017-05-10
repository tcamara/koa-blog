const koa = require('koa');
const app = module.exports = new koa();

// Add in routes for this subapp
app.use(require('./routes.js').middleware());
