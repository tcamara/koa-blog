const koa = require('koa');
const logger = require('koa-logger');
const route = require('koa-route');
const Pug = require('koa-pug');
// const mysql = require('./mysql');
const app = koa();

console.log('inside');

// Initialize pug for templating
const pug = new Pug({
    viewPath: './views',
    pretty: true,
    app: app // equals to pug.use(app) and app.use(pug.middleware)
});

// Set up user model
const User = require('./../../models/user');

// Set Up MySQL Connection
app.use(function* mysqlConnection(next) {
	global.db = yield connectionPool.getConnection();

	yield next;

	global.db.release();
});

app.use(function *() {
	const user = yield User.get('1');
	console.log(user);

	this.render('index', {
		header: 'Test',
		content: 'testing',
	}, true);
});
