import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table sets (
			name text primary key
		)
	`);
};