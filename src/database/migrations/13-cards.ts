import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table cards (
			id text primary key,
			rarity_text text not null references rarities(text)
		)
	`);

	await db.raw(`
		create table card_titles (
			title text not null unique,
			card_id integer not null references cards(id),
			language_name text not null references languages(name),

			primary key (card_id, language_name)
		)
	`);

	await db.raw(`
		create table cards_legalities (
			card_id text not null references cards(id),
			format_name text not null references formats(name),
			legality_text text not null references legalities(text),

			primary key (card_id, format_name)
		)
	`);

	await db.raw(`
		create table cards_entities (
			card_id text not null references cards(id),
			entity_id text not null references entities(id),
			
			primary key (card_id, entity_id)
		)
	`);
};