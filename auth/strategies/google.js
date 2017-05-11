const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('./../../models/user.js');

passport.use(new GoogleStrategy({
		clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
		clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
	},
	function(token, tokenSecret, profile, done) {
		console.log(profile);
		UserModel.getByField('googleId', profile.id)
			.then((user) => {
				done(null, user);
			}).catch(() => {
				done(null, false);
			});
	}
));

module.export = passport;