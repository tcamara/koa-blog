const www = module.exports = {};

www.index = function*() {
	yield this.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};

www.page = function*() {
	this.render('general/page', {
		title: 'Page',
		header: 'Page',
		content: 'Content',
	});
}
