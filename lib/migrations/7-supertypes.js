module.exports = function* (knex) {
	yield knex.schema.createTable('supertypes', table => {
		table.string('name').primary();
	});
};
