module.exports = function* (knex) {
	yield knex.schema.createTable('artists', table => {
		table.string('name').primary();
	});
};
