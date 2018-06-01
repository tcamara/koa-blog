const Koa = require('koa');
const handlebars = require('koa-handlebars');

const app = new Koa();

// Initialize handlebars for templating
app.use(handlebars({
	defaultLayout: 'main',
	cache: false, // TODO: remove when not in dev
	root: __dirname,
	layoutsDir: 'views/layouts',
	helpers: {
		blogName: () => global.settings.blogName,
		blogTagLine: () => global.settings.blogTagLine,
		copyrightYear: () => new Date().getFullYear(),
		beautifyDate: (str) => {
			const timeAgo = new Date(str);
			if (Object.prototype.toString.call(timeAgo) === '[object Date]') {
				if (Number.isNaN(timeAgo.getTime())) {
					return 'Not Valid';
				}

				const seconds = Math.floor((new Date() - timeAgo) / 1000);
				const intervals = [
					Math.floor(seconds / 31536000),
					Math.floor(seconds / 2592000),
					Math.floor(seconds / 86400),
					Math.floor(seconds / 3600),
					Math.floor(seconds / 60),
				];
				const times = [
					'year',
					'month',
					'day',
					'hour',
					'minute',
				];

				for (const key in intervals) {
					if (intervals[key] > 1) {
						return `${intervals[key]} ${times[key]}s ago`;
					}
					else if (intervals[key] === 1) {
						return `${intervals[key]} ${times[key]} ago`;
					}
				}

				return `${Math.floor(seconds)} seconds ago`;
			}

			return 'Not Valid';
		},
	},
}));

// Add in routes for this subapp
app.use(require('./routes.js').routes());

module.exports = app;
