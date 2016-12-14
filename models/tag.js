const Tag = module.exports = {};

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

Tag.getOne = function*(tagId) {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
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

Tag.getOneFormatted = function*(tagId) {
	const unformattedTag = yield Tag.getOne(tagId);

	if(unformattedTag) {
		return yield formatTag(unformattedTag);
	}
	else {
		return null;
	}
}

// Imposes no 'pagination' limits, for internal use only
Tag._getLimitless = function*(tagIds) {
	const queryString = 'SELECT * FROM `Tag` WHERE `id` IN (' + tagIds.join() + ')';
	
	return yield global.connectionPool.getConnection()
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

Tag.get = function*(params) {
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
	        throw new Error('Error in Tag.get: ' + err.message);
	    });
}

Tag.getFormatted = function*(params) {
	const unformattedTags = yield Tag.get(params);

	if(unformattedTags.length) {
		return yield formatTags(unformattedTags);
	}
	else {
		return [];
	}
}

function* formatTag(tag) {
	const formattedTags = yield formatTags([tag]);

	return formattedTags[0];
}

// Take tag objects straight from the DB and transform them into a view-ready format
function* formatTags(tags) {
	// Need the router to be able to use named routes for links
	const tagRoutes = require('./../apps/www/tags/routes.js');

	// Do the actual formatting
	for(let tag of tags) {
		// Handle links
		tag.href = tagRoutes.url('show', tag.id, tag.slug);
	}

	return tags;
}

Tag.create = function*(name) {
	const slug = slugify(name);
	const queryString = 'INSERT INTO `Tag` (`name`, `slug`) VALUES (?, ?)';

	return yield global.connectionPool.getConnection()
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

Tag.update = function*(tagId, name) {
	const slug = slugify(name);
	const queryString = 'UPDATE `Tag` SET `name` = ?, `slug` = ? WHERE `id` = ?';
	
	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [name, slug, tagId]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.update: ' + err.message);
	    });
}

Tag.delete = function*(tagId) {
	const queryString = 'DELETE FROM `Tag` WHERE `id` = ?';

	return yield global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, tagId);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Tag.delete: ' + err.message);
	    });
}
