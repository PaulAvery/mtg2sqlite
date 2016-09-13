module.exports = function* (knex) {
	yield knex.schema.createTable('cards', table => {
		table.string('id').primary().comment('The english card title. Easier to find/update during parse');

		table.enum('rarity', [
			'Common',
			'Uncommon',
			'Rare',
			'Mythic Rare',
			'Special',
			'Basic Land'
		]).notNullable();
	});

	/* The cards titles for each language */
	yield knex.schema.createTable('card_titles', table => {
		table.string('title').unique();

		table.integer('card_id')
		     .references('id')
		     .inTable('cards')
		     .notNullable();

		table.integer('language_name')
		     .references('name')
		     .inTable('languages')
		     .notNullable();

		table.unique([ 'card_id', 'language_name' ]);
	});

	/* The legalities of the card in various formats */
	yield knex.schema.createTable('legalities', table => {
		table.enum('legality', [
			'legal',
			'banned',
			'restricted'
		]).notNullable();

		table.string('card_id')
		     .references('id')
		     .inTable('cards')
		     .notNullable();

		table.string('format_name')
		     .references('name')
		     .inTable('formats')
		     .notNullable();

		table.unique([ 'card_id', 'format_name' ]);
	});

	/*
	 * Link between cards and entities. Neccessary because we have
	 * split, flip and double-sided cards as well as mend cards.
	 */
	yield knex.schema.createTable('cards_entities', table => {
		table.string('card_id').references('id').inTable('cards');
		table.string('entity_id').references('id').inTable('entities');

		table.unique([ 'card_id', 'entity_id' ]);
	});
};
