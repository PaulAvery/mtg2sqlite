import database from '../../database';

export type artist = {
	name: string
};

export default async function ensureArtist({ name }: artist) {
	let db = await database;
	await db.insert('replace into artists ($columns) values ($values)', { name });

	return name;
}
