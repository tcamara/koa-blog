const PostTag = module.exports = {};

const postTagsPerPage = 5;
const validSortColumns = {
	'postId': 1,
	'tadId': 1,
};

PostTag.exists = async (postId, tagId) => {
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` = ? && tagId = ?';

	return await global.connectionPool.getConnection()
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

PostTag.getByPost = async (postId, page = 0) => {
	const offset = page * postTagsPerPage;
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` = ? LIMIT ? OFFSET ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, postTagsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.getByPost: ' + err.message);
	    });
}

PostTag.getPostIdsByTag = async (tagId, page = 0) => {
	const postTags = await PostTag.getByTag(tagId, page);

	const posts = [];

	for(let postTag of postTags) {
		posts.push(postTag.postId);
	}

	return posts;
}

PostTag.getByTag = async (tagId, page) => {
	const offset = page * postTagsPerPage;
	const queryString = 'SELECT * FROM `PostTag` WHERE `tagId` = ? LIMIT ? OFFSET ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [tagId, postTagsPerPage, offset]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.getByTag: ' + err.message);
	    });
}

PostTag.getByPosts = async (postIds) => {
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` IN (' + postIds.join() + ')';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.getByPosts: ' + err.message);
	    });
}

PostTag.getByTags = async (tagIds) => {
	const queryString = 'SELECT * FROM `PostTag` WHERE `tagId` IN (' + tagIds.join() + ')';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in PostTag.getByTags: ' + err.message);
	    });
}

PostTag.create = async (postId, tagId) => {
	const queryString = 'INSERT INTO `PostTag` (`postId`, `tadId`) VALUES (?, ?)';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, tagId]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.create: ' + err.message);
	    });
}

PostTag.delete = async (postId, tagId) => {
	const queryString = 'DELETE FROM `PostTag` WHERE `postId` = ? && `tadId` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [postId, tagId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.delete: ' + err.message);
	    });
}

PostTag.deleteByPost = async (postId) => {
	const queryString = 'DELETE FROM `PostTag` WHERE `postId` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, postId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.deleteByPost: ' + err.message);
	    });
}

PostTag.deleteByTag = async (tagId) => {
	const queryString = 'DELETE FROM `PostTag` WHERE `tadId` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, tagId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in PostTag.deleteByTag: ' + err.message);
	    });
}
