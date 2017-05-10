const passport = require('koa-passport');
const localStrategy = require('./strategies/local');
const GoogleStrategy = require('./strategies/google');
const UserModel = require('./../models/user.js');

passport.serializeUser((user, done) => {
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	const user = UserModel.getOne(id).next().value;

	done(null, user);
});

module.exports = passport;