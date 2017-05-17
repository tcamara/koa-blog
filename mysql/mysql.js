const mysql = require('mysql2/promise');
const crud = require('./crud.js');
const queryBuilder = require('./queryBuilder.js');

// TODO: Move this out to a config file, dynamically load proper config file based on NODE_ENV
const dev_config = {
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: process.env.DB_CONNECTION_LIMIT,
};

global.connectionPool = mysql.createPool(dev_config);

module.exports = {
	selectMany: crud.selectMany,
	selectOne: crud.selectOne,
	insert: crud.insert,
	update: crud.update,
	remove: crud.remove,
	buildSelectQueryString: queryBuilder.buildSelectQueryString,
};
