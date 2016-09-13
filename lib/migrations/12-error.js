module.exports = function* (knex) {
	yield knex.schema.createTable('errors', table => {
		table.timestamps(true, true);

		table.string('message');
		table.string('type');
		table.text('stack');
	});
};
