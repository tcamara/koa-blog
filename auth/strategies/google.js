const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('./../../models/user.js');

passport.use(new GoogleStrategy({
		clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
		clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
	},
	function(token, tokenSecret, profile, done) {
		const user = UserModel.getByField('googleId', profile.id);

		if (user) {
			done(null, user);
		}
		else {
			done(null, false);
		}
	}
));

module.export = passport;