import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table rarities (
			text text primary key
		)
	`);
};