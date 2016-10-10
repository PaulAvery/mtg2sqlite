import database from '../../database';

export type language = {
	name: string,
	translatedName: string
};

export default async function ensureLanguage({ name, translatedName }: language) {
	let db = await database;
	await db.insert(
		'replace into languages ($columns) values ($values)',
		{ name, translatedName }
	);

	return name;
}
