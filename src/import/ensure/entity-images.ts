const database = require('../../database');

module.exports = function*({ imageGroup, entity, language, set }) {
	let db = yield database;
	let query = db.insert({
		set_name: set,
		entity_id: entity,
		language_name: language,
		imageGroup_id: imageGroup,
	}).into('imagegroups_entities');

	yield database.upsert(query);
};
