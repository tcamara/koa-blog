const Post = module.exports = {};

const postsPerPage = 3;
const validSortColumns = {
	'id': 1,
	'title': 1,
	'slug': 1,
	'author': 1,
	'timestamp': 1,
	'edit_timestamp': 1,
	'content': 0
};

Post.get = function*(id) {
	const result = yield global.db.query('SELECT * FROM `Post` WHERE `id` = ?', id);
	const posts = result[0];
	return posts[0];
}

Post.list = function*(page = 0, orderBy = 'id', direction = 'ASC') {
	const offset = page * postsPerPage;

	if(validSortColumns[orderBy] && (direction == 'ASC' || direction == 'DESC')) {
		const queryString = 'SELECT * FROM `Post` ORDER BY `' + orderBy + '` ' + direction + ' LIMIT ? OFFSET ?';
		const result = yield global.db.query(queryString, [postsPerPage, offset]);
		return result[0];
	}
}

Post.create = function*(title, author, content) {
	const slug = slugify(title);
	global.db.query('INSERT INTO `Post` (`title`, `slug`, `author`, `timestamp`, `content`) VALUES (?, ?, ?, now(), ?)', [title, slug, author, content]);
}

Post.update = function*(id, title, author, content) {
	const slug = slugify(title);
	global.db.query('UPDATE `Post` SET `title` = ?, `slug` = ?, `author` = ?, `edit_timestamp` = now(), `content` = ? WHERE `id` = ?', [title, slug, author, content, id]);
}

Post.delete = function*(id) {
	global.db.query('DELETE FROM `Post` WHERE `id` = ?', id);
}

function slugify(title) {
	return title.replace(/ /g, '-').toLowerCase();
}