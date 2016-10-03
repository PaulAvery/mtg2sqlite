import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table entities (
			id text primary key,

			text text,
			flavor text,
			power text,
			toughness text,
			loyalty integer,
			converted_mana_cost real not null default 0,

			red integer not null default 0,
			blue integer not null default 0,
			green integer not null default 0,
			black integer not null default 0,
			white integer not null default 0,

			cost_x integer not null default 0,
			cost_snow integer not null default 0,
			cost_generic integer not null default 0,
			cost_colorless integer not null default 0,

			cost_red integer not null default 0,
			cost_blue integer not null default 0,
			cost_green integer not null default 0,
			cost_black integer not null default 0,
			cost_white integer not null default 0,

			cost_hybrid_red integer not null default 0,
			cost_hybrid_blue integer not null default 0,
			cost_hybrid_green integer not null default 0,
			cost_hybrid_black integer not null default 0,
			cost_hybrid_white integer not null default 0,

			cost_phyrexian_red integer not null default 0,
			cost_phyrexian_blue integer not null default 0,
			cost_phyrexian_green integer not null default 0,
			cost_phyrexian_black integer not null default 0,
			cost_phyrexian_white integer not null default 0,

			cost_white_blue integer not null default 0,
			cost_white_black integer not null default 0,
			cost_white_red integer not null default 0,
			cost_white_green integer not null default 0,
			cost_blue_black integer not null default 0,
			cost_blue_red integer not null default 0,
			cost_blue_green integer not null default 0,
			cost_black_red integer not null default 0,
			cost_black_green integer not null default 0,
			cost_red_green integer not null default 0
		)
	`);

	await db.raw(`
		create table entities_subtypes (
			entity_id text not null references entities(id),
			subtype_name text not null references subtypes(name),

			primary key (entity_id, subtype_name)
		)
	`);

	await db.raw(`
		create table entities_types (
			entity_id text not null references entities(id),
			type_name text not null references types(name),

			primary key (entity_id, type_name)
		)
	`);

	await db.raw(`
		create table entities_supertypes (
			entity_id text not null references entities(id),
			supertype_name text not null references supertypes(name),

			primary key (entity_id, supertype_name)
		)
	`);

	await db.raw(`
		create table entity_titles (
			title text unique,
			entity_id text not null references entities(id),
			language_name text not null references languages(name),

			primary key (entity_id, language_name)
		)
	`);

	await db.raw(`
		create table imagegroups_entities (
			set_name text not null references sets(name),
			entity_id text not null references entities(id),
			language_name text not null references languages(name),
			imagegroup_id integer not null references imagegroups(id),

			primary key (imagegroup_id, entity_id, language_name, set_name)
		)
	`);
};