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
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query('SELECT * FROM `Post` WHERE `id` = ?', id);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	        console.log(err); // Should catch errors during either connection or query
	    });
}

Post.list = function*(page = 0, orderBy = 'id', direction = 'ASC') {
	const offset = page * postsPerPage;

	if(validSortColumns[orderBy] && (direction == 'ASC' || direction == 'DESC')) {
		const queryString = 'SELECT * FROM `Post` ORDER BY `' + orderBy + '` ' + direction + ' LIMIT ? OFFSET ?';
		
		return yield global.connectionPool.getConnection()
		    .then((connection) => {
		        const queryResult = connection.query(queryString, [postsPerPage, offset]);
		        connection.release();
		        return queryResult;
		    }).then((result) => {
		        return result[0];
		    }).catch((err) => {
		        console.log(err); // Should catch errors during either connection or query
		    });
	}
}

Post.create = function*(title, author, content) {
	const slug = slugify(title);

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query('INSERT INTO `Post` (`title`, `slug`, `author`, `timestamp`, `content`) VALUES (?, ?, ?, now(), ?)', [title, slug, author, content]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        console.log(err); // Should catch errors during either connection or query
	    });
}

Post.update = function*(id, title, author, content) {
	const slug = slugify(title);
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query('UPDATE `Post` SET `title` = ?, `slug` = ?, `author` = ?, `edit_timestamp` = now(), `content` = ? WHERE `id` = ?', [title, slug, author, content, id]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        console.log(err); // Should catch errors during either connection or query
	    });
}

Post.delete = function*(id) {
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query('DELETE FROM `Post` WHERE `id` = ?', id);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        console.log(err); // Should catch errors during either connection or query
	    });
}

function slugify(title) {
	return title.replace(/ /g, '-').toLowerCase();
}