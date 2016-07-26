const koa = require('koa');
const logger = require('koa-logger');
const compose = require('koa-compose');
const router = require('koa-router')();
const mysql = require('./mysql');
const app = koa();

// logger
app.use(logger());

// x-response-time
app.use(function *(next) {
	const start = new Date;
	yield next;
	const ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

app.use(function* subApp(next) {
	yield compose(require('./apps/www/index.js').middleware);
});

app.listen(3000);
console.log('listening');         