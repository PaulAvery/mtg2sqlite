import database from '../../database';

export type format = {
	name: string
};

export default async function ensureFormat({ name }: format) {
	let db = await database;
	await db.insert('replace into formats ($columns) values ($values)', { name });

	return name;
};
