// Sets up environmental variables based on the current environment
require('dotenv').config();

const path = require('path');
const koa = require('koa');
const logger = require('koa-logger');
const mount = require('koa-mount');
const serve = require('koa-static');
const mysql = require('./mysql');
const Setting = require('./models/setting.js');
const app = koa();

// Set appRoot and webroot for file uploads
global.appRoot = path.resolve(__dirname);
global.webRoot = path.join(appRoot, '/public');

// Include each sub-application
const wwwApp = require('./apps/www/index.js');
const apiApp = require('./apps/api/index.js');

// Logger
app.use(logger());

// x-response-time
app.use(function *(next) {
	const start = new Date;
	yield next;
	const ms = new Date - start;
	this.set('X-Response-Time', ms + 'ms');
});

// Serve static assets
app.use(serve('./public'));

// Load up the Setting table into a global object
app.use(function *(next) {
	const settings = yield Setting.getAll();
	global.settings = {};

	for(let setting of settings) {
		global.settings[setting.key] = setting.value;
	}

	yield next;
});

// Top-Level Error Handling
app.use(function *(next) {
	try {
		yield next;
	}
	catch(err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit('error', err, this);
	}
});

// Use koa-mount to mount each sub-application on its own path
app.use(mount('/api', apiApp));
app.use(mount('/', wwwApp));

// Start up the server on port 3000
app.listen(3000);
console.log('listening');         