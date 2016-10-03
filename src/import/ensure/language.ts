const database = require('../../database');

module.exports = function*({ name, translatedName }) {
	let db = yield database;
	let query = db.insert({ name, translated_name: translatedName }).into('languages');

	yield database.upsert(query);

	return name;
};
