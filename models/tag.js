const Tag = module.exports = {};

const PostTagModel = require('./postTag.js');
const mysql = require('./../mysql.js');
const slugify = require('./../utils/slugify.js');

const db = {
	'table': 'Tag',
	'pageSize': 5,
	'columns': {
		'id': { 'sortable': 1, 'filterable': 1 },
		'name': { 'sortable': 1, 'filterable': 1 },
		'slug': { 'sortable': 1, 'filterable': 1 },
		'numPosts': { 'sortable': 1, 'filterable': 1 },
	}
};

Tag.getOne = async (tagId) => {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, tagId);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Tag.getOne: ' + err.message);
	    });
}

Tag.getOneFormatted = async (tagId) => {
	const unformattedTag = await Tag.getOne(tagId);

	if(unformattedTag) {
		return formatTag(unformattedTag);
	}
	else {
		return null;
	}
}

// Imposes no 'pagination' limits, for internal use only
Tag._getLimitless = async (tagIds) => {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` IN (' + tagIds.join() + ')';
	
	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in Tag._getLimitless: ' + err.message);
	    });
}

Tag.get = async (params) => {
	const options = {
		page: params.page || 0,
		sort: params.sort || '-id', 
		filter: params.filter || null,
		query: params.query || null,
		fields: params.fields || null,
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
	        throw new Error('Error in Tag.get: ' + err.message);
	    });
}

Tag.getFormatted = async (params) => {
	const unformattedTags = await Tag.get(params);

	if(unformattedTags.length) {
		return formatTags(unformattedTags);
	}
	else {
		return [];
	}
}

function formatTag(tag) {
	const formattedTags = formatTags([tag]);

	return formattedTags[0];
}

// Take tag objects straight from the DB and transform them into a view-ready format
function formatTags(tags) {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./../apps/www/tags/routes.js');

	// Do the actual formatting
	for(let tag of tags) {
		// Handle links
		tag.href = tagRoutes.url('show', tag.id, tag.slug);
	}

	return tags;
}

Tag.getByPosts = async (posts) => {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./../apps/www/tags/routes.js');

	// Grab all the unique post IDs
	const postIds = {};
	for(let post of posts) {
		postIds[post.id] = [];
	}

	// Get all the tag IDs that are associated with our posts
	const postTags = await PostTagModel.getByPosts(Object.keys(postIds));

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
	const tagList = await Tag._getLimitless(Object.keys(tagIds));

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

Tag.create = async (name) => {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `Tag` (`name`, `slug`) VALUES (?, ?)';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Tag.create: ' + err.message);
	    });
}

Tag.update = async (tagId, name) => {
	const slug = slugify(name);
	const queryString = 'UPDATE `Tag` SET `name` = ?, `slug` = ? WHERE `id` = ?';
	
	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug, tagId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.update: ' + err.message);
	    });
}

Tag.delete = async (tagId) => {
	const queryString = 'DELETE FROM `Tag` WHERE `id` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, tagId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.delete: ' + err.message);
	    });
}
