const koa = require('koa');
const handlebars = require('koa-handlebars');
const app = module.exports = koa();

// Initialize handlebars for templating
app.use(handlebars({
	defaultLayout: "main",
	cache: false, // TODO: remove when not in dev
	root: __dirname,
	layoutsDir: 'views/layouts',
	helpers: {
		blogName: function() {
			return global.settings.blogName;
		},
		blogTagLine: function() {
			return global.settings.blogTagLine;
		},
		copyrightYear: function() {
			return new Date().getFullYear();
		},
		beautifyDate: function(str) {
	        var timeAgo = new Date(str);
	        if (Object.prototype.toString.call(timeAgo) === "[object Date]") {
	            if (isNaN(timeAgo.getTime())) {
	                return 'Not Valid';
	            } else {
	                var seconds = Math.floor((new Date() - timeAgo) / 1000),
	                intervals = [
	                    Math.floor(seconds / 31536000),
	                    Math.floor(seconds / 2592000),
	                    Math.floor(seconds / 86400),
	                    Math.floor(seconds / 3600),
	                    Math.floor(seconds / 60)
	                ],
	                times = [
	                    'year',
	                    'month',
	                    'day',
	                    'hour',
	                    'minute'
	                ];

	                var key;
	                for(key in intervals) {
	                    if (intervals[key] > 1)  
	                        return intervals[key] + ' ' + times[key] + 's ago';
	                    else if (intervals[key] === 1) 
	                        return intervals[key] + ' ' + times[key] + ' ago';
	                }

	                return Math.floor(seconds) + ' seconds ago';
	            }
	        } else {
	            return 'Not Valid';
	        }
	    }
	}
}));

// Add in routes for this subapp
app.use(require('./routes.js').middleware());
