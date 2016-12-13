const Post = module.exports = {};

const fs = require('fs');
const path = require('path');
const PostTag = require('./postTag.js');
const Tag = require('./tag.js');
const User = require('./user.js');
const mysql = require('./../mysql.js');

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

Post.getOne = function*(id) {
	const queryString = 'SELECT * FROM `Post` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, id);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Post.getOne: ' + err.message);
	    });
}

Post.getOneFormatted = function*(id) {
	// Retrieve the post we're looking for
	const post = yield Post.getOne(id);

	// Format it
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
	        const queryResult = connection.query(queryString, [db.pageSize, offset]);
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

// Calls Post.get, but also formats the results for display
Post.getFormatted = function*(params) {
	// Retrieve the list of posts we're looking for
	const unformattedPosts = yield Post.get(params);

	if(unformattedPosts.length) {
		return yield formatPosts(unformattedPosts);
	}
	else {
		return [];
	}
}

// Wrapper for a single-post version of formatPosts
function* formatPost(post) {
	const formattedPosts = yield formatPosts([post]);

	return formattedPosts[0];
}

// Take a post object straight from the DB and transform it into a 
function* formatPosts(posts) {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./../apps/www/posts/routes.js');

	// Get all the user data for users that are associated with our posts
	const users = yield getUsers(posts);

	// Get all the tag data for tags that are associated with our posts
	const tags = yield getTags(posts);

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

// TODO: move this into the user model?
function* getUsers(posts) {
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

// TODO: move this into the tag model?
function* getTags(posts) {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./../apps/www/tags/routes.js');

	// Grab all the unique post IDs
	const postIds = {};
	for(let post of posts) {
		postIds[post.id] = [];
	}

	// Get all the tag IDs that are associated with our posts
	const postTags = yield PostTag.getByPosts(Object.keys(postIds));

	// Grab all the tag IDs
	const tagIds = {};
	for(let tag of postTags) {
		tagIds[tag.tagId] = 1;
	}

	// Return nothing if these posts have no tags
	if(Object.keys(tagIds).length == 0) {
		return {};
	}

	// Get the tag data for all tags associated with our posts
	const tagList = yield Tag._getLimitless(Object.keys(tagIds));

	// Assign tag to tagId in hash
	for(let tag of tagList) {
		tag.link = tagRoutes.url('show', tag.id, tag.slug);
		tagIds[tag.id] = tag;
	}

	for(let postId in postIds) {
		for(let postTag of postTags) {
			if(postTag.postId == postId) {
				postIds[postId].push(tagIds[postTag.tagId]);
			}
		}
	}

	return postIds;
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

Post.update = function*(id, title, authorId, content) {
	const slug = slugify(title);
	const queryString = 'UPDATE `Post` SET `title` = ?, `slug` = ?, `authorId` = ?, `editTimestamp` = now(), `content` = ? WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [title, slug, authorId, content, id]);
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
