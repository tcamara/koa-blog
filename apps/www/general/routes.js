const Router = require('koa-router');
const koaBody = require('koa-body')({
	multipart: true
});
const passport = require('./../../../auth/auth.js');

const generalRouter = new Router();

const generalHandler = require('./handlers.js');

// Show home page
generalRouter.get('index', '/', generalHandler.index);

// Show login page
generalRouter.get('new', '/session', generalHandler.new);

// login page submission
generalRouter.post('create', '/session', koaBody, passport.authenticate('google', {
	scope: ['profile'],
	failureRedirect: '/session',
}), generalHandler.create);

// generalRouter.post('create', '/session', koaBody, passport.authenticate('local', {
// 	failureRedirect: '/session',
// }), generalHandler.create);

// login OAuth return page
generalRouter.get('googleCallback', '/session/google-callback', koaBody, passport.authenticate('google', { 
	failureRedirect: '/session'
}),
generalHandler.index);

// logout page submission
generalRouter.delete('delete', '/session', generalHandler.delete);

module.exports = generalRouter;
