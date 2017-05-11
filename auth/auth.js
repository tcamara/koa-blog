const passport = require('koa-passport');
const localStrategy = require('./strategies/local');
const GoogleStrategy = require('./strategies/google');
const UserModel = require('./../models/user.js');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	UserModel.getOne(id)
		.then((user) => {
			done(null, user);
		});
});

module.exports = passport;