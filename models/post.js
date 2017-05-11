const Post = module.exports = {};

const fs = require('fs');
const path = require('path');
const TagModel = require('./tag.js');
const UserModel = require('./user.js');
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

Post.getOne = async (postId) => {
	const queryString = 'SELECT * FROM `Post` WHERE `id` = ?';

	return await global.connectionPool.getConnection()
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

Post.getOneFormatted = async (postId) => {
	const post = await Post.getOne(postId);

	if(post) {
		return await formatPost(post);
	}
	else {
		return null;
	}
}

// Imposes no 'pagination' limits, for internal use only
Post._getLimitless = async (postIds) => {
	const queryString = 'SELECT * FROM `Post` WHERE `id` IN (' + postIds.join() + ')';
	
	return await global.connectionPool.getConnection()
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

Post.get = async (params) => {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id', 
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
		customWhere: params.customWhere || null,
	};

	const queryString = mysql.buildSelectQueryString(db, options);

	return await global.connectionPool.getConnection()
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

Post.getFormatted = async (params) => {
	const unformattedPosts = await Post.get(params);

	if(unformattedPosts.length) {
		return await formatPosts(unformattedPosts);
	}
	else {
		return [];
	}
}

async function formatPost(post) {
	const formattedPosts = await formatPosts([post]);

	return formattedPosts[0];
}

// Take post objects straight from the DB and transform them into a view-ready format
async function formatPosts(posts) {
	// Need the router to be able to use named routes for links
	const postRoutes = require('./../apps/www/posts/routes.js');

	// Get all the user data for users that are associated with our posts
	const users = await UserModel.getByPosts(posts);

	// Get all the tag data for tags that are associated with our posts
	const tags = await TagModel.getByPosts(posts);

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

Post.create = async (title, authorId, content, image) => {
	// Move uploaded image to correct storage location and return the permanent path
	await moveImage(image);
	
	const slug = slugify(title);
	const queryString = 'INSERT INTO `Post` (`title`, `slug`, `authorId`, `timestamp`, `content`, `image`) VALUES (?, ?, ?, now(), ?, ?)';
	const queryParams = [title, slug, authorId, content, image.name];

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, queryParams);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Post.create: ' + err.message);
	    });
}

async function moveImage(image) {
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

Post.update = async (postId, title, authorId, content) => {
	const slug = slugify(title);
	const queryString = 'UPDATE `Post` SET `title` = ?, `slug` = ?, `authorId` = ?, `content` = ? WHERE `id` = ?';
	const queryParams = [title, slug, authorId, content, postId];

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, queryParams);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.update: ' + err.message);
	    });
}

Post.delete = async (postId) => {
	const queryString = 'DELETE FROM `Post` WHERE `id` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, postId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Post.delete: ' + err.message);
	    });
}
