const database = require('../database');

module.exports = function*(data) {
	let db = yield database;

	yield db.raw(
		'replace into `languages` (name, translated_name) values (?, ?)',
		[ data.name, data.translatedName ]
	);
};
