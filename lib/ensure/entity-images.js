const database = require('../database');

module.exports = function*({ imageGroup, entity, language, set }) {
	let db = yield database;

	yield db.raw(
		'replace into `imagegroups_entities` (imagegroup_id, entity_id, language_name, set_name) values (?, ?, ?, ?)',
		[ imageGroup, entity, language, set ]
	);
};
