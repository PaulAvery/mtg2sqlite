import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table legalities (
			text text primary key
		)
	`);
};