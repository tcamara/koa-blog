const koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-router');
const Pug = require('koa-pug');
const app = module.exports = koa();

// Initialize pug for templating
const pug = new Pug({
    viewPath: './views',
    pretty: true,
});

app.use(pug.middleware);

// Set Up MySQL Connection
app.use(function* mysqlConnection(next) {
	global.db = yield connectionPool.getConnection();

	yield next;

	global.db.release();
});

// Add in routes for this subapp
app.use(require('./routes.js'));
