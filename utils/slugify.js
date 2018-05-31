function slugify(name) {
	return name.replace(/ /g, '-').toLowerCase();
}

module.exports = slugify;
