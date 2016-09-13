module.exports = function* (knex) {
	yield knex.schema.createTable('types', table => {
		table.string('name').primary();
	});
};
