module.exports = function* (knex) {
	yield knex.schema.createTable('images', table => {
		table.integer('id')
		     .primary()
		     .comment('The multiverse id');

		table.string('cardnumber');

		table.integer('artist_name')
		     .references('name').inTable('artists')
		     .notNullable();

		table.integer('imagegroup_id')
		     .references('id').inTable('imagegroups')
		     .notNullable();
	});
};
