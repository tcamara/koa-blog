const generalHandler = module.exports = {};

generalHandler.index = function*() {
	yield this.render('general/index', {
		title: 'Index',
		content: 'Index content',
	});
};
