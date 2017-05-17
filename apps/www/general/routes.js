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

generalRouter.get('googleCallback', '/session/google-callback', koaBody, authGoogleCallback, generalHandler.indexAction);
generalRouter.get('createGoogle', '/session/google', koaBody, authUsingGoogle, generalHandler.createAction);
generalRouter.get('new', loginUrl, generalHandler.newAction);
generalRouter.post('create', '/session', koaBody, authUsingLocal, generalHandler.createAction);
generalRouter.delete('delete', '/session', generalHandler.deleteAction);
generalRouter.get('index', '/', generalHandler.indexAction);

module.exports = generalRouter;
