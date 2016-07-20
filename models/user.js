const User = module.exports = {};

User.get = function*(id) {
	const result = yield global.db.query('SELECT * FROM `User` WHERE `id` = ?', id);
	const users = result[0];
	return users[0];
}
