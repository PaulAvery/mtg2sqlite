module.exports = function* (knex) {
	yield knex.schema.createTable('imagegroups', table => {
		table.increments('id').primary();
	});
};
