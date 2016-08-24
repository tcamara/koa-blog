const Post = module.exports = {};

const postsPerPage = 5;
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
	const queryString = 'SELECT * FROM `Post` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Post.get: ' + err.message);
	    });
}

Post.list = function*(page = 0, sort = '-id', searchTerm) {
	const offset = page * postsPerPage;
	const orderString = parseSortParam(sort);
	const queryString = 'SELECT * FROM `Post` ORDER BY ' + orderString + ' LIMIT ? OFFSET ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in Post.list: ' + err.message);
	    });
}

Post.create = function*(title, author, content) {
	const slug = slugify(title);
	const queryString = 'INSERT INTO `Post` (`title`, `slug`, `author`, `timestamp`, `content`) VALUES (?, ?, ?, now(), ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [title, slug, author, content]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Post.create: ' + err.message);
	    });
}

Post.update = function*(id, title, author, content) {
	const slug = slugify(title);
	const queryString = 'UPDATE `Post` SET `title` = ?, `slug` = ?, `author` = ?, `edit_timestamp` = now(), `content` = ? WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [title, slug, author, content, id]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.update: ' + err.message);
	    });
}

Post.delete = function*(id) {
	const queryString = 'DELETE FROM `Post` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.delete: ' + err.message);
	    });
}

function slugify(title) {
	return title.replace(/ /g, '-').toLowerCase();
}

function parseSortParam(queryStringChunk) {
	const items = queryStringChunk.split(',');
	const orderBy = [];

	for(let item of items) {
		let direction = '';

		// Starting with a '-' indicates a DESC order for this field
		if(item.charAt(0) === '-') {
			direction = ' DESC'
			item = item.substr(1); // Strip '-' character
		}

		// Ensure that only columns we want to be sortable are accepted
		if(validSortColumns[item]) {
			orderBy.push('`' + item + '`' + direction); 
		}
		else {
			throw new Error('Error in parseSortParam: Invalid column for sorting');
		}
	}

	return orderBy.join(', ');
}