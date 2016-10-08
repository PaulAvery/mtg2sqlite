import database from '../../database';

export type set = {
	name: string
};

export default async function ensureSet({ name }: set) {
	let db = await database;
	await db.raw('replace into sets ($columns) values ($values)', { name });

	return name;
}
