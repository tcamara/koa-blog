const generalRouter = require('koa-router')();
const generalHandler = require('./handlers.js');
const koaBody = require('koa-body')({
	multipart: true
});
const passport = require('./../../../auth/auth.js');
const loginUrl = '/session';

// TODO: CSRF tokens, especially for this step
const authUsingGoogle = passport.authenticate('google', {
	scope: ['openid profile email'],
	failureRedirect: loginUrl,
});

const authUsingLocal = passport.authenticate('local', {
	failureRedirect: loginUrl,
});

const authGoogleCallback = passport.authenticate('google', { 
	failureRedirect: loginUrl,
});

generalRouter.get('googleCallback', '/session/google-callback', koaBody, authGoogleCallback, generalHandler.index);
generalRouter.get('createGoogle', '/session/google', koaBody, authUsingGoogle, generalHandler.create);
generalRouter.get('new', loginUrl, generalHandler.new);
generalRouter.post('create', '/session', koaBody, authUsingLocal, generalHandler.create);
generalRouter.delete('delete', '/session', generalHandler.delete);
generalRouter.get('index', '/', generalHandler.index);

module.exports = generalRouter;
