const mysql = require('./../mysql/mysql.js');

async function getOne(key) {
	const queryString = 'SELECT * FROM `Setting` WHERE `key` = ?';

	return mysql.selectOne(queryString, key);
}

async function get(keys) {
	const queryString = `SELECT * FROM \`Setting\` WHERE \`key\` IN (${keys.join()})`;

	return mysql.selectMany(queryString);
}

async function getAll() {
	const queryString = 'SELECT * FROM `Setting`';

	return mysql.selectMany(queryString);
}

async function create(key, value) {
	const queryString = 'INSERT INTO `Setting` (`key`, `value`) VALUES (?, ?)';

	return mysql.insert(queryString, [key, value]);
}

async function update(key, value) {
	const queryString = 'UPDATE `Setting` SET `value` = ? WHERE `key` = ?';

	return mysql.update(queryString, queryString, [value, key]);
}

async function remove(key) {
	const queryString = 'DELETE FROM `Setting` WHERE `key` = ?';

	return mysql.remove(queryString, key);
}

module.exports = {
	getOne,
	get,
	getAll,
	create,
	update,
	remove,
};
