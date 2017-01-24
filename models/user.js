const User = module.exports = {};

const mysql = require('./../mysql.js');
const slugify = require('./../utils/slugify.js');

const db = {
	'table': 'User',
	'pageSize': 5,
	'columns': {
		'id': { 'sortable': 1, 'filterable': 1 },
		'name': { 'sortable': 1, 'filterable': 1 },
		'slug': { 'sortable': 1, 'filterable': 1 },
		'email': { 'sortable': 1, 'filterable': 1 },
		'password': { 'sortable': 0, 'filterable': 0 },
		'numPosts': { 'sortable': 1, 'filterable': 1 },
		'bio': { 'sortable': 0, 'filterable': 1 },
	}
};

User.getOne = function*(userId) {
	const queryString = 'SELECT * FROM `User` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, userId);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in User.getOne: ' + err.message);
	    });
}

User.getOneFormatted = function*(userId) {
	const user = yield User.getOne(userId);

	if(user) {
		return yield formatUser(user);
	}
	else {
		return null;
	}
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

User.get = function*(params) {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id', 
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
	};

	const queryString = mysql.buildSelectQueryString(db, options);

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in User.get: ' + err.message);
	    });
}

User.getFormatted = function*(params) {
	const unformattedUsers = yield User.get(params);

	if(unformattedUsers.length) {
		return yield formatUsers(unformattedUsers);
	}
	else {
		return [];
	}
}

function* formatUser(user) {
	const formattedUsers = yield formatUsers([user]);

	return formattedUsers[0];
}

// Take post objects straight from the DB and transform them into a view-ready format
function* formatUsers(users) {
	// Need the router to be able to use named routes for links
	const userRoutes = require('./../apps/www/users/routes.js');

	// Do the actual formatting
	for(let user of users) {
		// Handle links
		user.href = userRoutes.url('show', user.id, user.slug);
	}

	return users;
}

User.getByPosts = function*(posts) {
	// Need the router to be able to use named routes for links
	const userRoutes = require('./../apps/www/users/routes.js');

	const authorIds = {};
	for(let post of posts) {
		authorIds[post.authorId] = 1;
	}

	// Get the author data for our posts
	const users = yield User._getLimitless(Object.keys(authorIds));

	// Assign user to authorId in hash
	for(let user of users) {
		user.link = userRoutes.url('show', user.id);
		authorIds[user.id] = user;
	}

	return authorIds;
}

User.create = function*(name, email, password, bio) {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `User` (`name`, `slug`, `email`, `password`, `bio`) VALUES (?, ?, ?, ?, ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug, email, password, bio]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in User.create: ' + err.message);
	    });
}

User.update = function*(userId, name, email, password, bio) {
	const slug = slugify(name);
	const queryString = 'UPDATE `User` SET `name` = ?, `slug` = ?, `email` = ?, `password` = ?, `bio` = ?, WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug, email, password, bio, userId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in User.update: ' + err.message);
	    });
}

User.delete = function*(userId) {
	const queryString = 'DELETE FROM `User` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, userId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in User.delete: ' + err.message);
	    });
}
