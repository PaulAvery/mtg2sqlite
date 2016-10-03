const database = require('../../database');

module.exports = function*({ card, entity }) {
	let db = yield database;
	let query = db.insert({ card, entity }).into('cards_entities');

	yield database.upsert(query);
};
