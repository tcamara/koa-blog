const passport = require('koa-passport');
const localStrategy = require('./strategies/local');
const GoogleStrategy = require('./strategies/google');

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

module.exports = passport;