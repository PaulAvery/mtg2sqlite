const database = require('../database');

exports.ensureCardTitle = function*(data) {
	let db = yield database;

	yield db.raw(
		'replace into `card_titles` (card_id, title, language_name) values (?, ?, ?)',
		[ data.cardId, data.title, data.languageName ]
	);
};

exports.ensureCard = function*(data) {
	let db = yield database;

	yield db.raw(
		'replace into `cards` (id, rarity) values (?, ?)',
		[ data.title, data.rarity ]
	);
};
