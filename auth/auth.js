const passport = require('koa-passport');
const UserModel = require('./../models/user.js');
require('./strategies/local');
require('./strategies/google');

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
