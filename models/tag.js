const Tag = module.exports = {};

const tagsPerPage = 5;
const validSortColumns = {
	'id': 1,
	'name': 1,
	'slug': 1,
	'num_posts': 1
};

Tag.get = function*(id) {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Tag.get: ' + err.message);
	    });
}

Tag.list = function*(page = 0, sort = '-id', searchTerm) {
	const offset = page * tagsPerPage;
	const orderString = parseSortParam(sort);
	const queryString = 'SELECT * FROM `Tag` ORDER BY ' + orderString + ' LIMIT ? OFFSET ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [tagsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in Tag.list: ' + err.message);
	    });
}

Tag.create = function*(name) {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `Tag` (`name`, `slug`) VALUES (?, ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Tag.create: ' + err.message);
	    });
}

Tag.update = function*(id, name) {
	const slug = slugify(name);
	const queryString = 'UPDATE `Tag` SET `name` = ?, `slug` = ? WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug, id]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.update: ' + err.message);
	    });
}

Tag.delete = function*(id) {
	const queryString = 'DELETE FROM `Tag` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.delete: ' + err.message);
	    });
}

function slugify(name) {
	console.log(name);
	return name.replace(/ /g, '-').toLowerCase();
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