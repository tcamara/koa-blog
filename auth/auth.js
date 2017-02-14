const passport = require('koa-passport');
const googleStrategy = require('strategies/google');

const fetchUser = (() => {
	const user = { id: 1, username: 'test', password: 'test' }
	return user;
})();

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	try {
		const user = fetchUser();
		done(null, user);
	} catch(err) {
		done(err);
	}
});
