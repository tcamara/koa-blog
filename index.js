// Sets up environmental variables based on the current environment
require('dotenv').config();

const koa = require('koa');
const logger = require('koa-logger');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const mysql = require('./mysql');
const app = koa();

// Include each sub-application
const wwwApp = require('./apps/www/index.js');
const apiApp = require('./apps/api/index.js');

// logger
app.use(logger());

// Body Parser
app.use(bodyParser());

// x-response-time
app.use(function *(next) {
	const start = new Date;
	yield next;
	const ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// Use koa-mount to mount each sub-application on its own path
app.use(mount('/api', apiApp));
app.use(mount('/', wwwApp));

// Start up the server on port 3000
app.listen(3000);
console.log('listening');         