const database = require('../../database');

exports.ensureCardTitle = function*({ title, cardId, language }) {
	let db = yield database;
	let query = db.insert({ title, card_id: cardId, language_name: language }).into('card_titles');

	yield database.upsert(query);
};

exports.ensureCard = function*({ title, rarity }) {
	let db = yield database;
	let query = db.insert({ id: title, rarity }).into('cards');

	yield database.upsert(query);

	return title;
};
