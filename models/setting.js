const Setting = module.exports = {};

Setting.getOne = async function(key) {
	const queryString = 'SELECT * FROM `Setting` WHERE `key` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, key);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0][0];
	    }).catch((err) => {
	    	throw new Error('Error in Setting.getOne: ' + err.message);
	    });
}

Setting.get = async function(keys) {
	const queryString = 'SELECT * FROM `Setting` WHERE `key` IN (' + keys.join() + ')';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	    	throw new Error('Error in Setting.get: ' + err.message);
	    });
}

Setting.getAll = async function() {
	const queryString = 'SELECT * FROM `Setting`';

	return global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
	        return result[0];
	    }).catch((err) => {
	        throw new Error('Error in Setting.getAll: ' + err.message);
	    });
}

Setting.create = async function(key, value) {
	const queryString = 'INSERT INTO `Setting` (`key`, `value`) VALUES (?, ?)';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [key, value]);
	        connection.release();
	        return queryResult;
	    }).then((result) => {
		    return result[0].insertId;
	    }).catch((err) => {
	        throw new Error('Error in Setting.create: ' + err.message);
	    });
}

Setting.update = async function(key, value) {
	const queryString = 'UPDATE `Setting` SET `value` = ? WHERE `key` = ?';
	
	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, [value, key]);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Setting.update: ' + err.message);
	    });
}

Setting.delete = async function(key) {
	const queryString = 'DELETE FROM `Setting` WHERE `key` = ?';

	return await global.connectionPool.getConnection()
	    .then((connection) => {
	        const queryResult = connection.query(queryString, key);
	        connection.release();
	        return queryResult;
	    }).catch((err) => {
	        throw new Error('Error in Setting.delete: ' + err.message);
	    });
}
