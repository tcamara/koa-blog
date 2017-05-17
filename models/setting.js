const mysql = require('./../mysql/mysql.js');

async function getOne(key) {
	const queryString = 'SELECT * FROM `Setting` WHERE `key` = ?';

	return await mysql.selectOne(queryString, key);
}

async function get(keys) {
	const queryString = 'SELECT * FROM `Setting` WHERE `key` IN (' + keys.join() + ')';

	return await mysql.selectMany(queryString);
}

async function getAll() {
	const queryString = 'SELECT * FROM `Setting`';

	return await mysql.selectMany(queryString);
}

async function create(key, value) {
	const queryString = 'INSERT INTO `Setting` (`key`, `value`) VALUES (?, ?)';

	return await mysql.insert(queryString, [key, value]);
}

async function update(key, value) {
	const queryString = 'UPDATE `Setting` SET `value` = ? WHERE `key` = ?';

	return await mysql.update(queryString, queryString, [value, key]);
}

async function remove(key) {
	const queryString = 'DELETE FROM `Setting` WHERE `key` = ?';

	return await mysql.remove(queryString, key);
}

module.exports = {
	getOne,
	get,
	getAll,
	create,
	update,
	remove,
};
