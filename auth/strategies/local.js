const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./../../models/user.js');

passport.use(new LocalStrategy({
	usernameField: 'email',
}, (email, password, done) => {
	UserModel.getByField('email', email)
		.then((user) => {
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
