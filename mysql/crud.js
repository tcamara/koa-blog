function selectMany(...args) {
	return global.connectionPool.getConnection()
		.then((connection) => {
			const queryResult = connection.query(...args);
			connection.release();
			return queryResult;
		}).then(result => result[0])
		.catch((err) => {
			throw new Error(`Error in selectMany: ${err.message}`);
		});
}

function selectOne(...args) {
	return global.connectionPool.getConnection()
		.then((connection) => {
			const queryResult = connection.query(...args);
			connection.release();
			return queryResult;
		}).then(result => result[0][0])
		.catch((err) => {
			throw new Error(`Error in selectOne: ${err.message}`);
		});
}

function insert(...args) {
	return global.connectionPool.getConnection()
		.then((connection) => {
			const queryResult = connection.query(...args);
			connection.release();
			return queryResult;
		}).then(result => result[0].insertId)
		.catch((err) => {
			throw new Error(`Error in insert: ${err.message}`);
		});
}

function update(...args) {
	return global.connectionPool.getConnection()
		.then((connection) => {
			const queryResult = connection.query(...args);
			connection.release();
			return queryResult;
		}).catch((err) => {
			throw new Error(`Error in update: ${err.message}`);
		});
}

function remove(...args) {
	return global.connectionPool.getConnection()
		.then((connection) => {
			const queryResult = connection.query(...args);
			connection.release();
			return queryResult;
		}).catch((err) => {
			throw new Error(`Error in remove: ${err.message}`);
		});
}

module.exports = {
	selectMany,
	selectOne,
	insert,
	update,
	remove,
};
