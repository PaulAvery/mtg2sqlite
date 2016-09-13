const database = require('../database');

module.exports = function*({ card, entity }) {
	let db = yield database;

	yield db.raw(
		'replace into `cards_entities` (card_id, entity_id) values (?, ?)',
		[ card, entity ]
	);
};
