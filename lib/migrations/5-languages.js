module.exports = function* (knex) {
	yield knex.schema.createTable('languages', table => {
		table.string('name').primary();

		table.string('translated_name')
		     .notNullable()
		     .unique();
	});
};
