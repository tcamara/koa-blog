const www = module.exports = {};

www.index = function*() {
	this.render('general/index', {
		title: 'Index',
		header: 'Index',
	});
};

www.page = function*() {
	this.render('general/page', {
		title: 'Page',
		header: 'Page',
		content: 'Content',
	});
}
