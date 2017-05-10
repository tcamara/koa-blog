const generalRouter = require('koa-router')();
const generalHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});
const passport = require('./../../../auth/auth.js');
generalRouter.get('new', '/session', generalHandler.new);
// Show home page
generalRouter.get('index', '/', generalHandler.index);

// Show login page


// login page submission
generalRouter.get('create-google', '/session/google', koaBody, passport.authenticate('google', {
	scope: ['profile'],
	failureRedirect: '/session',
}), generalHandler.create);

generalRouter.post('create', '/session', koaBody, passport.authenticate('local', {
	failureRedirect: '/session',
}), generalHandler.create);

// login OAuth return page
generalRouter.get('googleCallback', '/session/google-callback', koaBody, passport.authenticate('google', { 
	failureRedirect: '/session'
}),
generalHandler.index);

// logout page submission
generalRouter.delete('delete', '/session', generalHandler.delete);

module.exports = generalRouter;
