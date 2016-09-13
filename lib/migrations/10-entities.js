module.exports = function* (knex) {
	yield knex.schema.createTable('entities', table => {
		table.string('id').primary().comment('English entity name, easier to find/update during parse');

		/* Basic information */
		table.text('text');
		table.text('flavor');
		table.string('power');
		table.string('toughness');
		table.integer('loyalty');
		table.float('converted_mana_cost').notNullable().defaultTo(0);

		/* The colors of the entity */
		table.boolean('red').notNullable().defaultTo(false);
		table.boolean('blue').notNullable().defaultTo(false);
		table.boolean('green').notNullable().defaultTo(false);
		table.boolean('black').notNullable().defaultTo(false);
		table.boolean('white').notNullable().defaultTo(false);

		/* The number of mana symbols of the entity */
		table.boolean('cost_x').notNullable().defaultTo(false);
		table.integer('cost_snow').notNullable().defaultTo(0);
		table.integer('cost_generic').notNullable().defaultTo(0);
		table.integer('cost_colorless').notNullable().defaultTo(0);

		/* Normal colors */
		table.integer('cost_red').notNullable().defaultTo(0);
		table.integer('cost_blue').notNullable().defaultTo(0);
		table.integer('cost_green').notNullable().defaultTo(0);
		table.integer('cost_black').notNullable().defaultTo(0);
		table.integer('cost_white').notNullable().defaultTo(0);

		/* Hybrid colors (2 life / color) */
		table.integer('cost_hybrid_red').notNullable().defaultTo(0);
		table.integer('cost_hybrid_blue').notNullable().defaultTo(0);
		table.integer('cost_hybrid_green').notNullable().defaultTo(0);
		table.integer('cost_hybrid_black').notNullable().defaultTo(0);
		table.integer('cost_hybrid_white').notNullable().defaultTo(0);

		/* Phyrexian colors */
		table.integer('cost_phyrexian_red').notNullable().defaultTo(0);
		table.integer('cost_phyrexian_blue').notNullable().defaultTo(0);
		table.integer('cost_phyrexian_green').notNullable().defaultTo(0);
		table.integer('cost_phyrexian_black').notNullable().defaultTo(0);
		table.integer('cost_phyrexian_white').notNullable().defaultTo(0);

		/* Combined colors */
		table.integer('cost_white_blue').notNullable().defaultTo(0);
		table.integer('cost_white_black').notNullable().defaultTo(0);
		table.integer('cost_white_red').notNullable().defaultTo(0);
		table.integer('cost_white_green').notNullable().defaultTo(0);
		table.integer('cost_blue_black').notNullable().defaultTo(0);
		table.integer('cost_blue_red').notNullable().defaultTo(0);
		table.integer('cost_blue_green').notNullable().defaultTo(0);
		table.integer('cost_black_red').notNullable().defaultTo(0);
		table.integer('cost_black_green').notNullable().defaultTo(0);
		table.integer('cost_red_green').notNullable().defaultTo(0);
	});

	/* Join tables for the types */
	yield knex.schema.createTable('entities_subtypes', table => {
		table.string('entity_id')
		     .references('id').inTable('entities')
		     .notNullable();

		table.string('subtype_name')
		     .references('name').inTable('subtypes')
		     .notNullable();

		table.unique([ 'entity_id', 'subtype_name' ]);
	});

	yield knex.schema.createTable('entities_types', table => {
		table.string('entity_id')
		     .references('id').inTable('entities')
		     .notNullable();

		table.string('type_name')
		     .references('name').inTable('types')
		     .notNullable();

		table.unique([ 'entity_id', 'type_name' ]);
	});

	yield knex.schema.createTable('entities_supertypes', table => {
		table.string('entity_id')
		     .references('id').inTable('entities')
		     .notNullable();

		table.string('supertype_name')
		     .references('name').inTable('supertypes')
		     .notNullable();

		table.unique([ 'entity_id', 'supertype_name' ]);
	});

	/* Title for each language */
	yield knex.schema.createTable('entity_titles', table => {
		table.string('title').unique();

		table.string('entity_id')
		     .references('id').inTable('entities')
		     .notNullable();

		table.string('language_name')
		     .references('name').inTable('languages')
		     .notNullable();

		table.unique([ 'entity_id', 'language_name' ]);
	});

	/* Link to the image representations of a specific set and language */
	yield knex.schema.createTable('imagegroups_entities', table => {
		table.integer('imagegroup_id')
		     .references('id').inTable('imagegroups')
		     .notNullable();

		table.string('entity_id')
		     .references('id').inTable('entities')
		     .notNullable();

		table.string('language_name')
		     .references('name').inTable('languages')
		     .notNullable();

		table.string('set_name')
		     .references('name').inTable('sets')
		     .notNullable();

		table.unique([ 'imagegroup_id', 'entity_id', 'language_name', 'set_name' ]);
	});
};
