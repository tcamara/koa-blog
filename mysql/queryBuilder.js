function buildSelectQueryString(db, options) {
	const fields = _handleFields(db, options);

	const table = '`' + db.table + '`';

	const where = _handleWhere(db, options);

	const orderBy = _handleOrderBy(db, options);

	const limitAndOffset = _handleLimitAndOffset(db, options);

	const queryString = `SELECT ${fields} FROM ${table} ${where}${orderBy}${limitAndOffset}`;

	return queryString;
}

function _handleFields(db, options) {
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

// TODO: split filter and query
// TODO: handle filtering/querying with operators other than "="
function _handleWhere(db, options) {
	let where = '';

	if(options.customWhere || options.filter) {
		where += 'WHERE ';

		if(options.customWhere) {
			where += options.customWhere + ' ';
		}
		else if(options.filter) {
			let iteration = 0;
			let number_of_filters = Object.keys(options.filter).length;

			for(var filter in options.filter) {
				where += "`" + filter + "` = '" + options.filter[filter] + "' ";
				if(number_of_filters > 1 && iteration < number_of_filters - 1) {
					where += "AND ";
				}
				iteration++;
			}
		}
	}

	return where;
}

function _handleLimitAndOffset(db, options) {
	const offset = options.page * db.pageSize;

	return `LIMIT ${db.pageSize} OFFSET ${offset}`;
}

function _handleOrderBy(db, options) {
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

module.exports = {
	buildSelectQueryString,
};
