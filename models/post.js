const Post = module.exports = {};

const fs = require('fs');
const path = require('path');
const Tag = require('./tag.js');
const User = require('./user.js');
const mysql = require('./../mysql.js');
const slugify = require('./../utils/slugify.js');

const postImagePath = '/images/posts/';
const fullPostImagePath = path.join(global.webRoot, postImagePath);
const db = {
	'table': 'Post',
	'pageSize': 5,
	'columns': {
		'id': { 'sortable': 1, 'filterable': 1 },
		'title': { 'sortable': 1, 'filterable': 1 },
		'slug': { 'sortable': 1, 'filterable': 1 },
		'authorId': { 'sortable': 1, 'filterable': 1 },
		'timestamp': { 'sortable': 1, 'filterable': 1 },
		'editTimestamp': { 'sortable': 1, 'filterable': 1 },
		'content': { 'sortable': 0, 'filterable': 1 },
	}
};

Post.getOne = function*(postId) {
	const queryString = 'SELECT * FROM `Post` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, postId);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Post.getOne: ' + err.message);
	    });
}

Post.getOneFormatted = function*(postId) {
	const post = yield Post.getOne(postId);

	if(post) {
		return yield formatPost(post);
	}
	else {
		return null;
	}
}

// Imposes no 'pagination' limits, for internal use only
Post._getLimitless = function*(postIds) {
	const queryString = 'SELECT * FROM `Post` WHERE `id` IN (' + postIds.join() + ')';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in Post._getLimitless: ' + err.message);
	    });
}

Post.get = function*(params) {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id', 
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
		customWhere: params.customWhere || null,
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
	        throw new Error('Error in Post.get: ' + err.message);
	    });
}

Post.getFormatted = function*(params) {
	const unformattedPosts = yield Post.get(params);

	if(unformattedPosts.length) {
		return yield formatPosts(unformattedPosts);
	}
	else {
		return [];
	}
}

function* formatPost(post) {
	const formattedPosts = yield formatPosts([post]);

	return formattedPosts[0];
}

// Take post objects straight from the DB and transform them into a view-ready format
function* formatPosts(posts) {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./../apps/www/posts/routes.js');

	// Get all the user data for users that are associated with our posts
	const users = yield User.getByPosts(posts);

	// Get all the tag data for tags that are associated with our posts
	const tags = yield Tag.getByPosts(posts);

	// Do the actual formatting
	for(let post of posts) {
		// Handle links
		post.href = postRoutes.url('show', post.id, post.slug);

		// Handle images
		post.image = postImagePath + post.image;

		// Handle author
		post.author = users[post.authorId];

		// Handle tags
		post.tags = tags[post.id];
	}

	return posts;
}

Post.create = function*(title, authorId, content, image) {
	// Move uploaded image to correct storage location and return the permanent path
	yield moveImage(image);
	
	const slug = slugify(title);
	const queryString = 'INSERT INTO `Post` (`title`, `slug`, `authorId`, `timestamp`, `content`, `image`) VALUES (?, ?, ?, now(), ?, ?)';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [title, slug, authorId, content, image.name]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Post.create: ' + err.message);
	    });
}

function* moveImage(image) {
	// If there is no image, just return
	if(image.size === 0) {
		return;
	}

	const source = fs.createReadStream(image.path);
	const destination = fs.createWriteStream(path.join(fullPostImagePath, image.name));

	source.pipe(destination);
	source.on('end', function() {
		fs.unlink(image.path);
	});
	source.on('error', function(err) {
		throw new Error('Error in moveImage: ' + err.message);
	})
}

Post.update = function*(postId, title, authorId, content) {
	const slug = slugify(title);
	const queryString = 'UPDATE `Post` SET `title` = ?, `slug` = ?, `authorId` = ?, `content` = ? WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [title, slug, authorId, content, postId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.update: ' + err.message);
	    });
}

Post.delete = function*(postId) {
	const queryString = 'DELETE FROM `Post` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, postId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.delete: ' + err.message);
	    });
}
