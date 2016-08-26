const koa = require('koa');
const handlebars = require('koa-handlebars');
const app = module.exports = koa();

// Initialize handlebars for templating
app.use(handlebars({
	defaultLayout: "main",
	cache: false, // TODO: remove when not in dev
	root: __dirname,
	layoutsDir: 'views/layouts'
}));

// Add in routes for this subapp
app.use(require('./routes.js').middleware());
