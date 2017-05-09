const passport = require('koa-passport')
const localStrategy = require('passport-local').Strategy;
const UserModel = require('./../../models/user.js');

passport.use(new localStrategy((email, password, done) => {
	const user = UserModel.getByField('email', email);

	// TODO: plaintext password is probably not a good long term solution :\
	if (email === user.email && password === user.password) {
		done(null, user);
	}
	else {
		done(null, false);
	}
}));

module.export = passport;