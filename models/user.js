const mysql = require('./../mysql/mysql.js');
const slugify = require('./../utils/slugify.js');

let userRoutes = null;

const db = {
	table: 'User',
	pageSize: 5,
	columns: {
		id: { sortable: 1, filterable: 1 },
		name: { sortable: 1, filterable: 1 },
		slug: { sortable: 1, filterable: 1 },
		email: { sortable: 1, filterable: 1 },
		password: { sortable: 0, filterable: 0 },
		numPosts: { sortable: 1, filterable: 1 },
		bio: { sortable: 0, filterable: 1 },
	},
};

async function getOne(userId) {
	const queryString = 'SELECT * FROM `User` WHERE `id` = ?';

	return mysql.selectOne(queryString, userId);
}

async function getByField(fieldName, fieldValue) {
	const queryString = `SELECT * FROM \`User\` WHERE \`${fieldName}\` = ?`;

	return mysql.selectOne(queryString, fieldValue);
}

async function get(params) {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id',
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
	};

	const queryString = mysql.buildSelectQueryString(db, options);

	return mysql.selectMany(queryString);
}

async function getOneFormatted(userId) {
	const user = await getOne(userId);

	if (user) {
		return _formatUser(user);
	}

	return null;
}

async function getFormatted(params) {
	const unformattedUsers = await get(params);

	if (unformattedUsers.length) {
		return _formatUsers(unformattedUsers);
	}

	return [];
}

async function getByPosts(posts) {
	const authorIds = {};
	for (const post of posts) {
		authorIds[post.authorId] = 1;
	}

	// Get the author data for our posts
	const users = await _getLimitless(Object.keys(authorIds));

	// Assign user to authorId in hash
	for (const user of users) {
		user.link = _getUserRoute('show', user.id);
		authorIds[user.id] = user;
	}

	return authorIds;
}

async function create(name, email, password, bio) {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `User` (`name`, `slug`, `email`, `password`, `bio`) VALUES (?, ?, ?, ?, ?)';
	const queryParams = [name, slug, email, password, bio];

	return mysql.insert(queryString, queryParams);
}

async function update(userId, name, email, password, bio) {
	const slug = slugify(name);
	const queryString = 'UPDATE `User` SET `name` = ?, `slug` = ?, `email` = ?, `password` = ?, `bio` = ?, WHERE `id` = ?';
	const queryParams = [name, slug, email, password, bio, userId];

	return mysql.update(queryString, queryParams);
}

async function remove(userId) {
	const queryString = 'DELETE FROM `User` WHERE `id` = ?';

	return mysql.remove(queryString, userId);
}

async function _getLimitless(userIds) {
	const queryString = `SELECT * FROM \`User\` WHERE \`id\` IN (${userIds.join()})`;

	return mysql.selectMany(queryString);
}

function _formatUser(user) {
	const formattedUsers = _formatUsers([user]);

	return formattedUsers[0];
}

function _formatUsers(users) {
	// Do the actual formatting
	for (const user of users) {
		// Handle links
		user.href = _getUserRoute('show', user.id, user.slug);
	}

	return users;
}

function _getUserRoute(...args) {
	if (userRoutes === null) {
		userRoutes = require('./../apps/www/users/routes.js');
	}

	return userRoutes.url(...args);
}

module.exports = {
	get,
	getOne,
	getByField,
	getOneFormatted,
	getFormatted,
	getByPosts,
	create,
	update,
	remove,
};
