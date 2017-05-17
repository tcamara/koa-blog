const fs = require('fs');
const path = require('path');
const TagModel = require('./tag.js');
const UserModel = require('./user.js');
const mysql = require('./../mysql/mysql.js');
const slugify = require('./../utils/slugify.js');
let postRoutes = null;

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

async function getOne(postId) {
	const queryString = 'SELECT * FROM `Post` WHERE `id` = ?';

	return await mysql.selectOne(queryString, postId);
}

async function get(params) {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id',
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
		customWhere: params.customWhere || null,
	};

	const queryString = mysql.buildSelectQueryString(db, options);

	return await mysql.selectMany(queryString);
}

async function getOneFormatted(postId) {
	const post = await getOne(postId);

	if(post) {
		return await _formatPost(post);
	}
	else {
		return null;
	}
}

async function getFormatted(params) {
	const unformattedPosts = await get(params);

	if(unformattedPosts.length) {
		return await _formatPosts(unformattedPosts);
	}
	else {
		return [];
	}
}

async function create(title, authorId, content, image) {
	// Move uploaded image to correct storage location and return the permanent path
	await moveImage(image);

	const slug = slugify(title);
	const queryString = 'INSERT INTO `Post` (`title`, `slug`, `authorId`, `timestamp`, `content`, `image`) VALUES (?, ?, ?, now(), ?, ?)';
	const queryParams = [title, slug, authorId, content, image.name];

	return await mysql.insert(queryString, queryParams);
}

async function update(postId, title, authorId, content) {
	const slug = slugify(title);
	const queryString = 'UPDATE `Post` SET `title` = ?, `slug` = ?, `authorId` = ?, `content` = ? WHERE `id` = ?';
	const queryParams = [title, slug, authorId, content, postId];

	return await mysql.update(queryString, queryParams);
}

async function remove(postId) {
	const queryString = 'DELETE FROM `Post` WHERE `id` = ?';

	return await mysql.remove(queryString, postId);
}

async function _moveImage(image) {
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

async function _formatPost(post) {
	const formattedPosts = await _formatPosts([post]);

	return formattedPosts[0];
}

// Take post objects straight from the DB and transform them into a view-ready format
async function _formatPosts(posts) {
	// Get all the user data for users that are associated with our posts
	const users = await UserModel.getByPosts(posts);

	// Get all the tag data for tags that are associated with our posts
	const tags = await TagModel.getByPosts(posts);

	// Do the actual formatting
	for(let post of posts) {
		// Handle links
		post.href = _getPostRoute('show', post.id, post.slug);

		// Handle images
		post.image = postImagePath + post.image;

		// Handle author
		post.author = users[post.authorId];

		// Handle tags
		post.tags = tags[post.id];
	}

	return posts;
}

function _getPostRoute(...args) {
	if (postRoutes === null) {
		postRoutes = require('./../apps/www/posts/routes.js');
	}

	return postRoutes.url(...args);
}

module.exports = {
	getOne,
	getOneFormatted,
	get,
	getFormatted,
	create,
	update,
	remove,
};
