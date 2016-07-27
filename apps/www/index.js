const koa = require('koa');
const Pug = require('koa-pug');
const app = module.exports = koa();

// Initialize pug for templating
const pug = new Pug({
    viewPath: './views',
    pretty: true,
});

app.use(pug.middleware);

// Add in routes for this subapp
app.use(require('./routes.js').middleware());
