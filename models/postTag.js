const mysql = require('./../mysql/mysql.js');
const postTagsPerPage = 5;
const validSortColumns = {
	'postId': 1,
	'tadId': 1,
};

async function exists(postId, tagId) {
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` = ? && tagId = ?';

	return await mysql.selectOne(queryString, [postId, tagId]);
}

async function getByPost(postId, page = 0) {
	const offset = page * postTagsPerPage;
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` = ? LIMIT ? OFFSET ?';

	return await mysql.selectMany(queryString, [postId, postTagsPerPage, offset]);
}

async function getPostIdsByTag(tagId, page = 0) {
	const postTags = await getByTag(tagId, page);

	const posts = [];

	for(let postTag of postTags) {
		posts.push(postTag.postId);
	}

	return posts;
}

async function getByTag(tagId, page) {
	const offset = page * postTagsPerPage;
	const queryString = 'SELECT * FROM `PostTag` WHERE `tagId` = ? LIMIT ? OFFSET ?';

	return await mysql.selectMany(queryString, [tagId, postTagsPerPage, offset]);
}

async function getByPosts(postIds) {
	const queryString = 'SELECT * FROM `PostTag` WHERE `postId` IN (' + postIds.join() + ')';

	return await mysql.selectMany(queryString);
}

async function getByTags(tagIds) {
	const queryString = 'SELECT * FROM `PostTag` WHERE `tagId` IN (' + tagIds.join() + ')';

	return await mysql.selectMany(queryString);
}

async function create(postId, tagId) {
	const queryString = 'INSERT INTO `PostTag` (`postId`, `tadId`) VALUES (?, ?)';

	return await mysql.insert(queryString, [postId, tagId]);
}

async function remove(postId, tagId) {
	const queryString = 'DELETE FROM `PostTag` WHERE `postId` = ? && `tadId` = ?';

	return await mysql.remove(queryString, [postId, tagId]);
}

async function removeByPost(postId) {
	const queryString = 'DELETE FROM `PostTag` WHERE `postId` = ?';

	return await mysql.remove(queryString, postId);
}

async function removeByTag(tagId) {
	const queryString = 'DELETE FROM `PostTag` WHERE `tadId` = ?';

	return await mysql.remove(queryString, tagId);
}

module.exports = {
	exists,
	getByPost,
	getPostIdsByTag,
	getByTag,
	getByPosts,
	getByTags,
	create,
	remove,
	removeByTag,
	removeByPost,
};
