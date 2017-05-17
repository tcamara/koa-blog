// Sets up environmental variables based on the current environment
require('dotenv').config();

const path = require('path');
const koa = require('koa');
const logger = require('koa-logger');
const mount = require('koa-mount');
const serve = require('koa-static');
const mysql = require('./mysql/mysql.js');
const Setting = require('./models/setting.js');
const passport = require('./auth/auth.js');
const session = require('koa-session-minimal');

const app = new koa();

app.keys = [process.env.SESSION_SECRET];
app.use(session());

// Set appRoot and webroot for file uploads
global.appRoot = path.resolve(__dirname);
global.webRoot = path.join(appRoot, '/public');

// // Logger
app.use(logger());

// x-response-time
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	ctx.set('X-Response-Time', ms + 'ms');
});

// // Serve static assets
app.use(serve('./public'));

// Load up the Setting table into a global object
app.use(async (ctx, next) => {
	const settings = await Setting.getAll();
	global.settings = {};

	for(let setting of settings) {
		global.settings[setting.key] = setting.value;
	}

	await next();
});

// Top-Level Error Handling
app.use(async (ctx, next) => {
	try {
		await next();
	}
	catch(err) {
		ctx.status = err.status || 500;
		ctx.body = err.message;
		ctx.app.emit('error', err, ctx);
	}
});

// Include each sub-application
const wwwApp = require('./apps/www/index.js');
// const apiApp = require('./apps/api/index.js');

// Set up authentication and session handling
app.use(passport.initialize());
app.use(passport.session());

// Use koa-mount to mount each sub-application on its own path
// app.use(mount('/api', apiApp));
app.use(mount('/', wwwApp));

// Start up the server on the .env specified port
app.listen(process.env.APP_PORT);
console.log('listening on port ' + process.env.APP_PORT);
