const passport = require('koa-passport');
const localStrategy = require('passport-local').Strategy;
// const googleStrategy = require('strategies/google');

// const GoogleStrategy = require('passport-google-auth').Strategy;

// passport.use(new GoogleStrategy({
// 		clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
// 		clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
// 		callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
// 	},
// 	function(token, tokenSecret, profile, done) {
// 		fetchUser().then(user => done(null, user));
// 	}
// ));

// const fetchUser = (() => {
// 	const user = { id: 1, username: 'testuser', password: 'testpass' }
// 	return user;
// })();

// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
// 	try {
// 		const user = fetchUser();
// 		done(null, user);
// 	} catch(err) {
// 		done(err);
// 	}
// });

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new localStrategy((username, password, done) => {
	if (username === 'user' && password === 'pass') {
		done(null, { userId: 99, userName: 'user', password: 'pass' });
	}
	else {
		done(null, false);
	}
}));

module.exports = passport;