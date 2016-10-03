const database = require('../../database');

module.exports = function*({ name }) {
	let db = yield database;
	let query = db.insert({ name }).into('artists');

	yield database.upsert(query);

	return name;
};
