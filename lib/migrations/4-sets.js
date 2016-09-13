module.exports = function* (knex) {
	yield knex.schema.createTable('sets', table => {
		table.string('name').primary();
	});
};
