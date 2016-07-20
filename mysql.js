const mysql = require('mysql2/promise');

// TODO: Move this out to a config file, dynamically load proper config file based on NODE_ENV
const dev_config = {
	host: 'localhost',
	database: 'blog',
	user: 'blog_user',
	password: 'bad_password',
	connectionLimit: 100,
};

global.connectionPool = mysql.createPool(dev_config);

// connectionPool.getConnection()
//     .then((conn) => {
//         var res = conn.query('SELECT * FROM `User`');
//         conn.release();
//         return res;
//     }).then((result) => {
//         console.log(result[0][0]);
//     }).catch((err) => {
//         console.log(err); // Should catch errors during either connection or query
//     });
