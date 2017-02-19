const Router = require('koa-router');

const authRouter = new Router();

const authHandler = require('./handlers.js');

// Google Auth
authRouter.get('google', '/google', authHandler.google);

// Google Auth Callback
authRouter.get('googleCallback', '/google/callback', authHandler.googleCallback);

// 
// authRouter.post('create', '/', koaBody, authHandler.create);

module.exports = authRouter;