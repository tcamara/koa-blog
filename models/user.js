const User = module.exports = {};

const usersPerPage = 5;
const validSortColumns = {
	'id': 1,
	'name': 1,
	'email': 1,
	'numPosts': 1,
	'bio': 0
};

User.getOne = function*(id) {
	const queryString = 'SELECT * FROM `User` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in User.getOne: ' + err.message);
	    });
}

// Imposes no 'pagination' limits, for internal use only
User._getLimitless = function*(userIds) {
	const queryString = 'SELECT * FROM `User` WHERE `id` IN (' + userIds.join() + ')';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in User._getLimitless: ' + err.message);
	    });
}

User.get = function*(page = 0, sort = '-id', searchTerm) {
	const offset = page * usersPerPage;
	const orderString = parseSortParam(sort);
	const queryString = 'SELECT * FROM `User` ORDER BY ' + orderString + ' LIMIT ? OFFSET ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [usersPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in User.get: ' + err.message);
	    });
}

User.create = function*(name, email, password, bio) {
	const queryString = 'INSERT INTO `User` (`name`, `email`, `password`, `bio`) VALUES (?, ?, ?, ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, email, password, bio]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in User.create: ' + err.message);
	    });
}

User.update = function*(id, name, email, password, bio) {
	const queryString = 'UPDATE `User` SET `name` = ?, `email` = ?, `password` = ?, `bio` = ?, WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, email, password, bio, id]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in User.update: ' + err.message);
	    });
}

User.delete = function*(id) {
	const queryString = 'DELETE FROM `User` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in User.delete: ' + err.message);
	    });
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