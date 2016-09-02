const koa = require('koa');
const handlebars = require('koa-handlebars');
const app = module.exports = koa();

// Initialize handlebars for templating
app.use(handlebars({
	defaultLayout: "main",
	cache: false, // TODO: remove when not in dev
	root: __dirname,
	layoutsDir: 'views/layouts',
	helpers: {
		blogName: function() {
			return global.settings.blogName;
		},
		blogTagLine: function() {
			return global.settings.blogTagLine;
		},
		copyrightYear: function() {
			return new Date().getFullYear();
		}
	}
}));

// Add in routes for this subapp
app.use(require('./routes.js').middleware());
