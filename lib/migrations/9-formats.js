module.exports = function* (knex) {
	yield knex.schema.createTable('formats', table => {
		table.string('name').primary();
	});
};
