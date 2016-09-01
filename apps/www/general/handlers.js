const www = module.exports = {};

www.index = function*() {
	yield this.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};
