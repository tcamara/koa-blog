const koa = require('koa');
const logger = require('koa-logger');
const mount = require('koa-mount');
const mysql = require('./mysql');
const app = koa();

// Include each sub-application
const wwwApp = require('./apps/www/index.js');
const apiApp = require('./apps/api/index.js');

// logger
app.use(logger());

// x-response-time
app.use(function *(next) {
	const start = new Date;
	yield next;
	const ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// Set Up MySQL Connection
app.use(function* mysqlConnection(next) {
	global.db = yield connectionPool.getConnection();

	yield next;

	global.db.release();
});

// Use koa-mount to mount each sub-application on its own path
app.use(mount('/api', apiApp));
app.use(mount('/', wwwApp));


app.listen(3000);
console.log('listening');         