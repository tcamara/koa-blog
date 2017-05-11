const passport = require('koa-passport')
const localStrategy = require('passport-local').Strategy;
const UserModel = require('./../../models/user.js');

passport.use(new localStrategy({
	usernameField: 'email',
}, (email, password, done) => {
	UserModel.getByField('email', email)
		.then((user) => {
			console.log(user);
			// TODO: plaintext password is probably not a good long term solution :\
			if (email === user.email && password === user.password) {
				done(null, user);
			}
			else {
				done(null, false);
			}
		}).catch(() => {
			done(null, false);
		});
}));

module.export = passport;