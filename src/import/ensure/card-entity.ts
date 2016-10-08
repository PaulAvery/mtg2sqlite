import database from '../../database';

export type link = {
	card: string,
	entity: string
};

export default async function ensureCardEntityLink({ card, entity }: link) {
	let db = await database;
	await db.raw('replace into cards_entities ($columns) values ($values)', { card, entity });

	return name;
}