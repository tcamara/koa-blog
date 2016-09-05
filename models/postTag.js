const PostTag = module.exports = {};

const postTagsPerPage = 5;
const validSortColumns = {
	'postId': 1,
	'tadId': 1,
};

PostTag.exists = function*(postId, tagId) {
	const queryString = 'SELECT * FROM `Post_Tag` WHERE `postId` = ? && tagId = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, tagId]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.exists: ' + err.message);
	    });
}

PostTag.listByPost = function*(postId, page = 0) {
	const offset = page * postsPerPage;
	const queryString = 'SELECT * FROM `Post_Tag` WHERE `postId` = ? LIMIT ? OFFSET ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, postsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.listByPost: ' + err.message);
	    });
}

PostTag.listByTag = function*(tagId, page = 0) {
	const offset = page * postsPerPage;
	const queryString = 'SELECT * FROM `Post_Tag` WHERE `tadId` = ? LIMIT ? OFFSET ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [tagId, postsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.listByTag: ' + err.message);
	    });
}

PostTag.listTagsByPost = function*(postIds) {
	const queryString = 'SELECT * FROM `Post_Tag` WHERE `postId` IN (' + postIds.join() + ')';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.listTagsByPost: ' + err.message);
	    });
}

PostTag.create = function*(postId, tagId) {
	const queryString = 'INSERT INTO `Post_Tag` (`postId`, `tadId`) VALUES (?, ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, tagId]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Post.create: ' + err.message);
	    });
}

PostTag.delete = function*(postId, tagId) {
	const queryString = 'DELETE FROM `Post_Tag` WHERE `postId` = ? && `tadId` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, tagId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.delete: ' + err.message);
	    });
}

PostTag.deleteByPost = function*(postId) {
	const queryString = 'DELETE FROM `Post_Tag` WHERE `postId` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, postId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.deleteByPost: ' + err.message);
	    });
}

PostTag.deleteByTag = function*(tagId) {
	const queryString = 'DELETE FROM `Post_Tag` WHERE `tadId` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, tagId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.deleteByTag: ' + err.message);
	    });
}
