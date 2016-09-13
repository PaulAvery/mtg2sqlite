module.exports = function* (knex) {
	yield knex.schema.createTable('subtypes', table => {
		table.string('name').primary();
	});
};
