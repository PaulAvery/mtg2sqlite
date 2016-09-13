const database = require('../database');

module.exports = function*(data) {
	let db = yield database;

	yield db.raw(
		'replace into `artists` (name) values (?)',
		[ data.name ]
	);
};
