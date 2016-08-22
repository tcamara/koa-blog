const mysql = require('mysql2/promise');

// TODO: Move this out to a config file, dynamically load proper config file based on NODE_ENV
const dev_config = {
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	connectionLimit: process.env.DB_CONNECTION_LIMIT,
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
