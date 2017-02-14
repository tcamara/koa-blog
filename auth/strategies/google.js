const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-auth').Strategy;

passport.use(new GoogleStrategy({
		clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
		clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
	},
	function(token, tokenSecret, profile, done) {
		// retrieve user ...
		fetchUser().then(user => done(null, user));
	}
));