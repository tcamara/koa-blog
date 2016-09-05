const Post = module.exports = {};

const fs = require('fs');
const path = require('path');
const PostTag = require('./postTag.js');
const Tag = require('./tag.js');
const User = require('./user.js');

const postImagePath = '/images/posts/';
const fullPostImagePath = path.join(global.webRoot, postImagePath);
const postsPerPage = 5;
const validSortColumns = {
	'id': 1,
	'title': 1,
	'slug': 1,
	'authorId': 1,
	'timestamp': 1,
	'editTimestamp': 1,
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

// This does no formatting of the post data, and is therefore faster, but should really
// only be used as a base function to assist with the main list function
Post.listRaw = function*(page = 0, sort = '-id', searchTerm) {
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

Post.list = function*(page = 0, sort = '-id', searchTerm) {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./../apps/www/posts/routes.js');

	// Retrieve the list of posts we're looking for
	const postList = yield Post.listRaw(page, sort, searchTerm);

	// Grab all the post and author IDs
	const postIds = [];
	const authorIds = {};
	for(let post of postList) {
		postIds.push(post.id);
		authorIds[post.authorId] = 1;
	}

	// Get the author data for our posts
	const userList = yield User._list(Object.keys(authorIds));

	// Get all the tag IDs that are associated with our posts
	const postTags = yield PostTag.listTagsByPost(postIds);

	// Grab all the tag IDs
	const tagIds = {};
	for(let tag of postTags) {
		tagIds[tag.tagId] = 1;
	}

	// Get the tag data for all tags associated with our posts
	const tagList = yield Tag._list(Object.keys(tagIds));

	// TODO: this is a really naive approach, improve it
	for(let post of postList) {
		// Handle links
		post.href = postRoutes.url('show', post.id, post.slug);

		// Handle images
		post.image = postImagePath + post.image;

		// Handle tags
		post.tags = [];
		for(let postTag of postTags) {
			if(postTag.postId === post.id) {
				for(let tag of tagList) {
					if(tag.id === postTag.tagId) {
						post.tags.push(tag);
					}
				}
			}
		}

		// Handle author
		for(let user of userList) {
			if(user.id === post.authorId) {
				post.author = user;
			}
		}
	}

	return postList;
}

function* getTagsForPosts(postList) {
	const postIds = [];
	for(let post of postList) {
		postIds.push(post.id);
	}

	const test = PostTag.listTagsByPost(postIds);
	return test;
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