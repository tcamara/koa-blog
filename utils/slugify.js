export function slugify(name) {
	return name.replace(/ /g, '-').toLowerCase();
}
