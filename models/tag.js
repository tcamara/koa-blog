const PostTagModel = require('./postTag.js');
const mysql = require('./../mysql/mysql.js');
const slugify = require('./../utils/slugify.js');

let tagRoutes = null;

const db = {
	table: 'Tag',
	pageSize: 5,
	columns: {
		id: { sortable: 1, filterable: 1 },
		name: { sortable: 1, filterable: 1 },
		slug: { sortable: 1, filterable: 1 },
		numPosts: { sortable: 1, filterable: 1 },
	},
};

async function getOne(tagId) {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` = ?';

	return mysql.selectOne(queryString, tagId);
}

async function getOneFormatted(tagId) {
	const unformattedTag = await getOne(tagId);

	if (unformattedTag) {
		return _formatTag(unformattedTag);
	}

	return null;
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

async function getFormatted(params) {
	const unformattedTags = await get(params);

	if (unformattedTags.length) {
		return _formatTags(unformattedTags);
	}

	return [];
}

async function getByPosts(posts) {
	// Grab all the unique post IDs
	const postIds = {};
	for (const post of posts) {
		postIds[post.id] = [];
	}

	// Get all the tag IDs that are associated with our posts
	const postTags = await PostTagModel.getByPosts(Object.keys(postIds));

	// Grab all the tag IDs
	const tagIds = {};
	for (const tag of postTags) {
		tagIds[tag.tagId] = 1;
	}

	// Return nothing if these posts have no tags
	if (Object.keys(tagIds).length === 0) {
		return {};
	}

	// Get the tag data for all tags associated with our posts
	const tagList = await _getLimitless(Object.keys(tagIds));

	// Assign tag to tagId in hash
	for (const tag of tagList) {
		tag.link = _getTagRoute('show', tag.id, tag.slug);
		tagIds[tag.id] = tag;
	}

	for (const postId in postIds) {
		for (const postTag of postTags) {
			if (postTag.postId === postId) {
				postIds[postId].push(tagIds[postTag.tagId]);
			}
		}
	}

	return postIds;
}

async function create(name) {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `Tag` (`name`, `slug`) VALUES (?, ?)';

	return mysql.insert(queryString, [name, slug]);
}

async function update(tagId, name) {
	const slug = slugify(name);
	const queryString = 'UPDATE `Tag` SET `name` = ?, `slug` = ? WHERE `id` = ?';

	return mysql.update(queryString, queryString, [name, slug, tagId]);
}

async function remove(tagId) {
	const queryString = 'DELETE FROM `Tag` WHERE `id` = ?';

	return mysql.remove(queryString, tagId);
}

// Imposes no 'pagination' limits, for internal use only
async function _getLimitless(tagIds) {
	const queryString = `SELECT * FROM \`Tag\` WHERE \`id\` IN (${tagIds.join()})`;

	return mysql.selectMany(queryString);
}

function _formatTag(tag) {
	const formattedTags = _formatTags([tag]);

	return formattedTags[0];
}

// Take tag objects straight from the DB and transform them into a view-ready format
function _formatTags(tags) {
	// Do the actual formatting
	for (const tag of tags) {
		// Handle links
		tag.href = _getTagRoute('show', tag.id, tag.slug);
	}

	return tags;
}

function _getTagRoute(...args) {
	if (tagRoutes === null) {
		tagRoutes = require('./../apps/www/tags/routes.js');
	}

	return tagRoutes.url(...args);
}

module.exports = {
	getOne,
	getOneFormatted,
	get,
	getFormatted,
	getByPosts,
	create,
	update,
	remove,
};
