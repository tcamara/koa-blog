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

export function buildSelectQueryString(db, options) {
	// Handle fields, use * unless otherwise specified
	const fields = handleFields(db, options);
	
	// Handle table
	const table = '`' + db.table + '`';

	// Handle where clause
	const where = handleWhere(db, options);

	// Handle order clause
	const orderBy = handleOrderBy(db, options);

	// Handle limit and offset
	const limit = handleLimit(db, options);
	
	const queryString = `SELECT ${fields} FROM ${table} ${where}${orderBy}${limit}`;

	console.log(queryString);

	return queryString;
}

function handleFields(db, options) {
	let fields = '*';
	
	if(options.fields) {
		// Turn the string into an array
		options.fields = options.fields.split(',');
		
		// Strip out any invalid fields
		fields = options.fields.filter(function(item) {
			if(db.columns[item]) {
				return true;
			}
			else {
				return false
			}
		// Properly format the fields
		}).map(function(item) { 
			return '`' + item + '`';
		})
		.join(', ');
	}

	return fields;
}

function handleWhere(db, options) {
	let where = '';
	
	if(options.filter || options.query) {

	}

	return where;
}

function handleLimit(db, options) {
	const offset = options.page * db.pageSize;

	return `LIMIT ${db.pageSize} OFFSET ${offset}`;
}

function handleOrderBy(db, options) {
	if(!options.sort) {
		return '';
	}
		
	const items = options.sort.split(',');
	const orderBy = [];

	for(let item of items) {
		let direction = '';

		// Starting with a '-' indicates a DESC order for this field
		if(item.charAt(0) === '-') {
			direction = ' DESC'
			item = item.substr(1); // Strip '-' character
		}

		// Ensure that only columns we want to be sortable are accepted
		if(db.columns[item].sortable) {
			orderBy.push('`' + item + '`' + direction); 
		}
		else {
			throw new Error('Error in parseSortParam: Invalid column for sorting');
		}
	}

	return 'ORDER BY ' + orderBy.join(', ') + ' ';
}